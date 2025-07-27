// blog-backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getConnection, sql } = require('./config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth'); // <-- auth middleware'ini içeri aktardık

// YENİ EKLENECEK: authOptional middleware'ı
const authOptional = (req, res, next) => {
    let token = req.headers['x-auth-token'] || req.headers['authorization']; // Tokenı header'dan al

    // Token yoksa kullanıcı bilgisi null olur ve devam ederiz
    if (!token) {
        req.user = null;
        return next();
    }

    // "Bearer " öneki varsa kaldır
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    // Token'ı doğrula
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Token geçersizse bile hata döndürme, sadece req.user'ı null yap
            req.user = null;
        } else {
            // Token geçerliyse, payload'dan gelen 'user' objesini req.user'a ata
            req.user = decoded.user;
        }
        next(); // Sonraki middleware veya route handler'a geç
    });
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware'ler
app.use(cors());
app.use(express.json());

// Veritabanına bağlanma
connectDB();

// Basit bir test endpoint'i
app.get('/', (req, res) => {
    res.send('Blog Backend API Çalışıyor!');
});

// Kullanıcı Kayıt (Register) API Endpoint'i
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        const pool = getConnection();
        const request = pool.request();

        const existingUser = await request
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .query('SELECT id FROM Users WHERE username = @username OR email = @email');

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({ message: 'Bu kullanıcı adı veya e-posta zaten kullanımda.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Yeni bir request objesi kullanmaya gerek yok, çünkü burada sadece bir INSERT var ve parametre isimleri benzersiz.
        const insertRequest = pool.request(); // Eğer emin olmak istersen, burada da ayrı bir request kullanabilirsin.
        insertRequest.input('newUsername', sql.NVarChar, username);
        insertRequest.input('newEmail', sql.NVarChar, email);
        insertRequest.input('newPasswordHash', sql.NVarChar, hashedPassword);

        await insertRequest.query(
            `INSERT INTO Users (username, email, password_hash)
            VALUES (@newUsername, @newEmail, @newPasswordHash)`
        );

        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi!' });

    } catch (err) {
        console.error('Kayıt sırasında hata oluştu:', err);
        res.status(500).json({ message: 'Sunucu hatası: Kayıt yapılamadı.' });
    }
});


// Kullanıcı Giriş (Login) API Endpoint'i
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Lütfen e-posta ve şifrenizi girin.' });
    }

    try {
        const pool = getConnection();
        const request = pool.request();

        const result = await request
            .input('email', sql.NVarChar, email)
            .query('SELECT id, username, email, password_hash FROM Users WHERE email = @email');

        const user = result.recordset[0];

        if (!user) {
            return res.status(400).json({ message: 'Geçersiz kimlik bilgileri.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Geçersiz kimlik bilgileri.' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    message: 'Giriş başarılı.',
                    user: payload.user
                });
            }
        );

    } catch (err) {
        console.error('Giriş sırasında hata oluştu:', err);
        res.status(500).json({ message: 'Sunucu hatası: Giriş yapılamadı.' });
    }
});

// Yeni: Blog Yazısı Oluşturma API Endpoint'i (Auth gerektirir)
app.post('/api/posts', auth, async (req, res) => {
    const { title, content, excerpt, imageUrl, published } = req.body;
    const user_id = req.user.id; // Token'dan gelen kullanıcı ID'si

    if (!title || !content) {
        return res.status(400).json({ message: 'Başlık ve içerik zorunludur.' });
    }

    try {
        const pool = getConnection();
        const request = pool.request();

        request.input('userId', sql.Int, user_id);
        request.input('title', sql.NVarChar, title);
        request.input('content', sql.NVarChar(sql.MAX), content);
        request.input('excerpt', sql.NVarChar, excerpt || null);
        request.input('imageUrl', sql.NVarChar(sql.MAX), imageUrl || null);
        request.input('published', sql.Bit, published !== undefined ? published : false);

        await request.query(
            `INSERT INTO Posts (user_id, title, content, excerpt, image_url, published)
            VALUES (@userId, @title, @content, @excerpt, @imageUrl, @published)`
        );

        res.status(201).json({ message: 'Blog yazısı başarıyla oluşturuldu!' });

    } catch (err) {
        console.error('Yazı oluşturma sırasında hata oluştu:', err);
        res.status(500).json({ message: 'Sunucu hatası: Yazı oluşturulamadı.' });
    }
});

// Yeni: Tüm Blog Yazılarını Getirme API Endpoint'i
// Herkesin erişimine açık olacak (auth middleware'i yok)
app.get('/api/posts', async (req, res) => {
    try {
        const pool = getConnection();
        const request = pool.request();

        const result = await request.query(`
            SELECT
                p.id,
                p.title,
                p.content,
                p.excerpt,
                p.image_url,
                p.created_at,
                p.updated_at,
                p.published,
                u.username AS authorUsername,
                u.id AS authorId
            FROM Posts AS p
            JOIN Users AS u ON p.user_id = u.id
            WHERE p.published = 1
            ORDER BY p.created_at DESC
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error('Yazıları getirme sırasında hata oluştu:', err);
        res.status(500).json({ message: 'Sunucu hatası: Yazılar yüklenemedi.' });
    }
});

// Tek Bir Blog Yazısını ID'ye Göre Getirme API Endpoint'i
app.get('/api/posts/:id', authOptional, async (req, res) => { // <-- authOptional middleware'ı buraya eklendi
    const postId = req.params.id;

    try {
        const pool = getConnection();
        const request = pool.request();

        const result = await request
            .input('postId', sql.Int, postId)
            .query(`
                SELECT
                    p.id,
                    p.title,
                    p.content,
                    p.excerpt,
                    p.image_url,
                    p.created_at,
                    p.updated_at,
                    p.published,
                    p.user_id,
                    u.username AS authorUsername,
                    u.id AS authorId
                FROM Posts AS p
                JOIN Users AS u ON p.user_id = u.id
                WHERE p.id = @postId
            `);

        const post = result.recordset[0];

        if (!post) {
            return res.status(404).json({ message: 'Yazı bulunamadı.' });
        }

        // YENİ EKLENECEK: Taslak kontrolü ve yetkilendirme
        // Eğer yazı yayınlanmamışsa (taslak) ve:
        //   - req.user null ise (yani kullanıcı giriş yapmamışsa) VEYA
        //   - req.user.id, yazının user_id'sine eşit değilse (yani kullanıcı yazının sahibi değilse)
        // o zaman 403 (Forbidden) hatası döndür.
        if (!post.published && (!req.user || post.user_id !== req.user.id)) {
            return res.status(403).json({ message: 'Bu taslak yazıya erişim yetkiniz yok.' });
        }

        res.json(post);

    } catch (err) {
        console.error('Yazıyı getirme sırasında hata oluştu:', err);
        res.status(500).json({ message: 'Sunucu hatası: Yazı yüklenemedi.' });
    }
});

// Kullanıcının Tüm Blog Yazılarını ve Kendi Profil Bilgisini Getirme API Endpoint'i
// Rota adı değiştirildi: /api/users/:id/profile
app.get('/api/users/:id/profile', auth, async (req, res) => { // <-- Rota ve parametre adı güncellendi
    // `req.params.id` ile gelen ID'yi doğrudan kullanmayacağız,
    // bunun yerine `auth` middleware'ından gelen `req.user.id`'yi kullanacağız
    // çünkü bu rota sadece oturum açmış kullanıcının kendi profilini göstermeli.
    const authenticatedUserId = req.user.id;

    // Frontend'den gelen id ile authenticatedUserId'yi karşılaştırma satırını kaldırıyoruz,
    // çünkü bu rotanın doğası gereği her zaman kendi profilini görecek.
    // if (userIdFromParams !== authenticatedUserId) {
    //     return res.status(403).json({ message: 'Bu kullanıcıya ait yazıları görüntüleme yetkiniz yok.' });
    // }

    try {
        const pool = getConnection();

        // Kullanıcı bilgilerini getirme
        const userRequest = pool.request(); // Yeni bir request objesi kullanmak daha güvenlidir
        const userResult = await userRequest
            .input('userId', sql.Int, authenticatedUserId)
            .query('SELECT id, username, email FROM Users WHERE id = @userId');

        const user = userResult.recordset[0];

        if (!user) {
            // Eğer geçerli bir token'a rağmen kullanıcı bulunamazsa, bu bir problemdir.
            return res.status(404).json({ message: 'Profil bilgileri bulunamadı.' });
        }

        // Kullanıcının yazılarını getirme (taslaklar dahil)
        const postsRequest = pool.request(); // Yeni bir request objesi kullanmak daha güvenlidir
        const resultPosts = await postsRequest
            .input('userId', sql.Int, authenticatedUserId)
            .query(`
                SELECT
                    id,
                    title,
                    content,
                    excerpt,
                    image_url,
                    created_at,
                    updated_at,
                    published
                FROM Posts
                WHERE user_id = @userId
                ORDER BY created_at DESC
            `);

        res.json({
            user: { // Frontend'in beklediği 'user' objesi
                id: user.id,
                username: user.username,
                email: user.email,
            },
            posts: resultPosts.recordset // Frontend'in beklediği 'posts' dizisi
        });

    } catch (err) {
        console.error('Kullanıcı yazıları ve profil getirme sırasında hata oluştu:', err);
        res.status(500).json({ message: 'Sunucu hatası: Kullanıcı yazıları veya profil yüklenemedi.' });
    }
});

// YENİ EKLENECEK: Yazı Güncelleme API Endpoint'i (Auth ve Yetki gerektirir)
app.put('/api/posts/:id', auth, async (req, res) => {
    const postId = req.params.id;
    const authenticatedUserId = req.user.id; // Token'dan gelen kullanıcı ID'si
    const { title, content, excerpt, imageUrl, published } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Başlık ve içerik boş olamaz.' });
    }

    try {
        const pool = getConnection();
        const request = pool.request();

        // 1. Yazının varlığını ve sahibini kontrol et
        const postResult = await request
            .input('postId', sql.Int, postId)
            .query('SELECT user_id FROM Posts WHERE id = @postId'); // user_id'yi çekiyoruz

        const post = postResult.recordset[0];

        if (!post) {
            return res.status(404).json({ message: 'Güncellenecek yazı bulunamadı.' });
        }

        // 2. Kullanıcının yazının sahibi olup olmadığını kontrol et
        if (post.user_id !== authenticatedUserId) {
            return res.status(403).json({ message: 'Bu yazıyı güncelleme yetkiniz yok.' });
        }

        // 3. Yazıyı güncelle
        const updateRequest = pool.request(); // Yeni bir request objesi kullanmak daha güvenlidir
        updateRequest.input('postId', sql.Int, postId);
        updateRequest.input('title', sql.NVarChar, title);
        updateRequest.input('content', sql.NVarChar(sql.MAX), content);
        updateRequest.input('excerpt', sql.NVarChar, excerpt || null);
        updateRequest.input('imageUrl', sql.NVarChar(sql.MAX), imageUrl || null);
        // published değeri doğrudan body'den geliyor
        updateRequest.input('published', sql.Bit, published);
        updateRequest.input('updatedAt', sql.DateTime, new Date()); // updated_at'i manuel olarak güncelliyoruz

        await updateRequest.query(`
            UPDATE Posts
            SET
                title = @title,
                content = @content,
                excerpt = @excerpt,
                image_url = @imageUrl,
                published = @published,
                updated_at = @updatedAt
            WHERE id = @postId
        `);

        res.status(200).json({ message: 'Yazı başarıyla güncellendi!' });

    } catch (err) {
        console.error('Yazı güncelleme sırasında hata oluştu:', err);
        res.status(500).json({ message: 'Sunucu hatası: Yazı güncellenemedi.' });
    }
});

// ... (Mevcut PUT /api/posts/:id rotanızdan sonra veya uygun bir yere) ...

// YENİ EKLENECEK: Yazı Silme API Endpoint'i (Auth ve Yetki gerektirir)
app.delete('/api/posts/:id', auth, async (req, res) => {
    const postId = req.params.id;
    const authenticatedUserId = req.user.id; // Token'dan gelen kullanıcı ID'si

    try {
        const pool = getConnection();
        const request = pool.request();

        // 1. Yazının varlığını ve sahibini kontrol et
        const postResult = await request
            .input('postId', sql.Int, postId)
            .query('SELECT user_id FROM Posts WHERE id = @postId'); // user_id'yi çekiyoruz

        const post = postResult.recordset[0];

        if (!post) {
            return res.status(404).json({ message: 'Silinecek yazı bulunamadı.' });
        }

        // 2. Kullanıcının yazının sahibi olup olmadığını kontrol et
        if (post.user_id !== authenticatedUserId) {
            return res.status(403).json({ message: 'Bu yazıyı silme yetkiniz yok.' });
        }

        // 3. Yazıyı sil
        const deleteRequest = pool.request(); // Yeni bir request objesi kullanmak daha güvenlidir
        deleteRequest.input('postId', sql.Int, postId);
        await deleteRequest.query('DELETE FROM Posts WHERE id = @postId');

        res.status(200).json({ message: 'Yazı başarıyla silindi!' });

    } catch (err) {
        console.error('Yazı silme sırasında hata oluştu:', err);
        res.status(500).json({ message: 'Sunucu hatası: Yazı silinemedi.' });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access at: http://localhost:${PORT}`);
});