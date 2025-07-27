import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams'ı import ettik
import { useAuth } from '../context/AuthContext';
import postService from '../services/post.service';
import './CreatePostPage.css';
import { toast } from 'react-toastify';

function CreatePostPage() {
    const { currentUser, loading: authLoading } = useAuth(); // AuthContext'ten loading'i de al
    const { postId } = useParams(); // URL'den postId'yi al (eğer varsa)
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [published, setPublished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Form gönderme yüklemesi
    const [error, setError] = useState(null); // Özel hata mesajı için
    const [isEditing, setIsEditing] = useState(false); // Düzenleme modunda mı?

    useEffect(() => {
        // Auth context yüklenene kadar bekle
        if (authLoading) {
            return;
        }

        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Eğer URL'de postId varsa, düzenleme modundayız demektir.
        if (postId) {
            setIsEditing(true); // Düzenleme moduna geç
            setIsSubmitting(true); // Yazı verileri yüklenirken loading göster
            setError(null); // Hataları temizle

            postService.getPostById(postId)
                .then(postData => {
                    // Backend'den gelen postData'nın yapısına dikkat edin.
                    // Eğer `authorId` gibi bir alan geliyorsa, o zaman kontrol edebiliriz.
                    // Backend'den `user_id` alanı gelmeliydi, `authorId` değil.
                    // `server.js`'deki `/api/posts/:id` rotasında `p.user_id`'yi çektiğimizden emin olun.
                    if (postData.user_id !== currentUser.id) { // Backend'den gelen `user_id` ile karşılaştır
                        toast.error('Bu yazıyı düzenleme yetkiniz yok.');
                        navigate('/profile'); // Yetkisizse profil sayfasına yönlendir
                        return;
                    }

                    setTitle(postData.title);
                    setContent(postData.content);
                    setExcerpt(postData.excerpt || ''); // Null ise boş string yap
                    setImageUrl(postData.image_url || ''); // Null ise boş string yap
                    setPublished(postData.published);
                })
                .catch(err => {
                    console.error("Yazı yüklenirken hata:", err);
                    const errorMessage = err.message || 'Yazı yüklenirken bir hata oluştu.';
                    setError(errorMessage);
                    toast.error(errorMessage);
                    // Yetkisiz veya bulunamadı hatası durumunda yönlendirme
                    if (err.message && (err.message.includes('Giriş yapmalısınız.') || err.message.includes('Yazı bulunamadı') || err.message.includes('yetkiniz yok'))) {
                        navigate('/profile'); // Yönlendirme yapabiliriz
                    }
                })
                .finally(() => {
                    setIsSubmitting(false); // Yükleme bitti
                });
        }
    }, [postId, currentUser, authLoading, navigate]); // Dependencylere authLoading'i de ekle

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Form gönderilirken loading göster
        setError(null);

        if (!title || !content) {
            toast.error('Başlık ve içerik alanları zorunludur.');
            setIsSubmitting(false);
            return;
        }

        try {
            if (isEditing) {
                // Mevcut yazıyı güncelle
                await postService.updatePost(postId, title, content, excerpt, imageUrl, published);
                toast.success('Yazı başarıyla güncellendi!');
            } else {
                // Yeni yazı oluştur
                await postService.createPost(title, content, excerpt, imageUrl, published);
                toast.success('Yazı başarıyla oluşturuldu!');
            }
            navigate('/profile'); // Başarılı işlem sonrası profil sayfasına yönlendir
        } catch (err) {
            console.error('Yazı işlemi sırasında hata:', err);
            const errorMessage = err.message || 'Bir hata oluştu.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false); // Yükleme bitti
        }
    };

    // Eğer AuthProvider hala yükleniyorsa veya kullanıcı giriş yapmadıysa formu gösterme
    if (authLoading || (!currentUser && !authLoading)) {
        return <div>Yükleniyor...</div>;
    }

    // Yazı yüklenirken veya gönderilirken bir şeyler göster
    if (isSubmitting && isEditing) { // Sadece düzenleme modunda ve yazı yüklenirken
        return <div className="create-post-container">Yazı bilgileri yükleniyor...</div>;
    }


    return (
        <div className="create-post-container">
            <h2>{isEditing ? 'Yazıyı Düzenle' : 'Yeni Yazı Oluştur'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="create-post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Başlık:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="excerpt">Özet (Opsiyonel):</label>
                    <input
                        type="text"
                        id="excerpt"
                        name="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Resim URL'si (Opsiyonel):</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">İçerik:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="10"
                        required
                    ></textarea>
                </div>
                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="published"
                        name="published"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                    />
                    <label htmlFor="published">Yayımla</label>
                </div>
                <button type="submit" className="create-post-button" disabled={isSubmitting}>
                    {isSubmitting ? 'İşleniyor...' : (isEditing ? 'Yazıyı Güncelle' : 'Yazıyı Kaydet')}
                </button>
            </form>
        </div>
    );
}

export default CreatePostPage;