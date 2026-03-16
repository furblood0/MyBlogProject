import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams'ı import ettik
import { useAuth } from '../context/AuthContext';
import postService from '../services/post.service';
import './CreatePostPage.css';
import { toast } from 'react-toastify';
import { Card } from './ui/Card';
import { colors, spacing } from '../theme';
import { PostEditor } from './posts/PostEditor';

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
                    const isPublished =
                        postData.status === 'published' ||
                        postData.published === true;
                    setPublished(isPublished);
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

    const handleSubmit = async (payload) => {
        setIsSubmitting(true); // Form gönderilirken loading göster
        setError(null);

        const { title: pTitle, content: pContent, excerpt: pExcerpt, imageUrl: pImageUrl, published: pPublished } =
            payload;

        if (!pTitle || !pContent) {
            toast.error('Başlık ve içerik alanları zorunludur.');
            setIsSubmitting(false);
            return;
        }

        try {
            if (isEditing) {
                // Mevcut yazıyı güncelle
                await postService.updatePost(
                    postId,
                    pTitle,
                    pContent,
                    pExcerpt,
                    pImageUrl,
                    pPublished
                );
                toast.success('Yazı başarıyla güncellendi!');
            } else {
                // Yeni yazı oluştur
                await postService.createPost(
                    pTitle,
                    pContent,
                    pExcerpt,
                    pImageUrl,
                    pPublished
                );
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
        return (
            <div style={{ paddingTop: spacing.xl }}>
                <Card>
                    <div>Yükleniyor...</div>
                </Card>
            </div>
        );
    }

    // Yazı yüklenirken veya gönderilirken bir şeyler göster
    if (isSubmitting && isEditing) { // Sadece düzenleme modunda ve yazı yüklenirken
        return (
            <div style={{ paddingTop: spacing.xl }}>
                <Card>
                    <div>Yazı bilgileri yükleniyor...</div>
                </Card>
            </div>
        );
    }


    return (
        <div style={{ paddingTop: spacing.xl }}>
            <Card>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: spacing.lg,
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0 }}>
                            {isEditing ? 'Yazıyı düzenle' : 'Yeni yazı oluştur'}
                        </h2>
                        <p
                            style={{
                                margin: 0,
                                marginTop: spacing.xs,
                                fontSize: '0.9rem',
                                color: colors.textMuted,
                            }}
                        >
                            Başlık, kısa özet ve içeriği doldur; istersen taslak
                            olarak kaydet.
                        </p>
                    </div>
                </div>

                <PostEditor
                    initialTitle={title}
                    initialExcerpt={excerpt}
                    initialImageUrl={imageUrl}
                    initialContent={content}
                    initialPublished={published}
                    onSubmit={handleSubmit}
                    submitting={isSubmitting}
                    error={error}
                />
            </Card>
        </div>
    );
}

export default CreatePostPage;