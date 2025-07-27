import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Mevcut AuthContext kullanımınız
import authService from '../services/auth.service';
import postService from '../services/post.service'; // Silme işlemi için zaten mevcut
import { toast } from 'react-toastify'; // Toast bildirimleri için zaten mevcut

// Font Awesome ikonlarını içeri aktar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './ProfilePage.css'; // Stil dosyanız

function ProfilePage() {
    // `id` useParams'tan geliyordu, ancak biz artık currentUser.id kullanacağız
    // Dolayısıyla `id`'ye ihtiyacımız yok
    // const { id } = useParams(); // <-- BU SATIRI YORUM SATIRI YAP VEYA SİL
    const { currentUser, loading: authLoading, logout } = useAuth(); // logout'u da ekledik
    const [profileUser, setProfileUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Veri çekme yüklemesi
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            // Auth context yüklenene kadar bekle
            if (authLoading) {
                setLoading(true); // Yükleme devam ederken
                return;
            }

            // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
            if (!currentUser) {
                navigate('/login');
                return;
            }

            // Frontend'de URL'den gelen `id` parametresi artık gereksiz,
            // çünkü `authService.getUserProfileAndPosts` kendi token'ından gelen
            // `currentUser.id`'yi kullanıyor.
            // Bu nedenle, `requestedId` kontrolü de gereksizleşiyor.
            // Backend tarafında `/api/users/:id/profile` rotasını
            // `users/${user.id}/profile` şeklinde çağırdığımızdan,
            // frontend'den URL'ye gönderilen ID önemsiz hale geliyor.
            // Dolayısıyla buradaki `requestedId` ve `if (requestedId !== currentUserId)` bloğunu kaldırabiliriz.

            try {
                // authService.getUserProfileAndPosts metoduna artık id göndermiyoruz,
                // çünkü o kendi içinde currentUser.id'yi kullanıyor.
                const data = await authService.getUserProfileAndPosts(); // <-- ID PARAMETRESİNİ KALDIRDIK
                setProfileUser(data.user);
                setUserPosts(data.posts);
            } catch (err) {
                console.error('Profil bilgisi getirme hatası:', err);
                // Hata durumunda 401/403 ise kullanıcıyı logout et
                if (err.message && (err.message.includes('Giriş yapmalısınız.') || err.message.includes('Profil bilgileri yüklenemedi.'))) {
                    toast.error('Oturumunuzun süresi dolmuş veya yetkiniz yok. Lütfen tekrar giriş yapın.');
                    logout(); // Kullanıcıyı AuthContext'ten log out et
                    navigate('/login'); // Login sayfasına yönlendir
                } else {
                    setError(err.message || 'Profil bilgileri yüklenirken bir hata oluştu.');
                    toast.error('Profil yüklenirken bir hata oluştu.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [currentUser, authLoading, navigate, logout]); // Dependencylere logout'u ekledik

    // Yazı Silme İşlevi
    const handleDeletePost = async (postId) => {
        if (!window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            // postService.deletePost artık token'ı kendi içinde alıyor
            await postService.deletePost(postId); // <-- SADECE postId GÖNDERİYORUZ
            toast.success('Yazı başarıyla silindi!');
            setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        } catch (err) {
            console.error("Yazı silinirken hata oluştu:", err);
            toast.error(err.message || 'Yazı silinirken bir hata oluştu.');
            // Yetkilendirme hatası durumunda logout
            if (err.message && (err.message.includes('Giriş yapmalısınız.') || err.message.includes('Yazı silme başarısız oldu.'))) {
                logout();
                navigate('/login');
            }
        }
    };

    // Yazı Düzenleme İşlevi
    const handleEditPost = (postId) => {
        navigate(`/edit-post/${postId}`); // `/edit-post/:id` rotasına yönlendir
    };

    if (loading || authLoading) {
        return <div className="loading-profile-message">Profil bilgileri yükleniyor...</div>;
    }

    if (error) {
        return <div className="error-profile-message">Hata: {error}</div>;
    }

    // currentUser'ın varlığını zaten useEffect başında kontrol ettik.
    // profileUser'ın null olması durumunu da burada ele alabiliriz.
    if (!profileUser) {
        return <div className="no-profile-found-message">Profil bulunamadı veya yüklenemedi.</div>;
    }

    return (
        <div className="profile-container">
            <h2 className="profile-title">Profilim</h2>
            <div className="profile-info">
                <p><strong>Kullanıcı Adı:</strong> {profileUser.username}</p>
                <p><strong>E-posta:</strong> {profileUser.email}</p>
            </div>

            <h3 className="my-posts-heading">Yazdıklarım</h3>
            {userPosts.length === 0 ? (
                <p className="no-posts-message">Henüz hiç yazı yazmadınız.</p>
            ) : (
                <div className="profile-post-list">
                    {userPosts.map((post) => (
                        <div key={post.id} className="profile-post-card">
                            <Link to={`/posts/${post.id}`} className="profile-post-card-title">
                                <h4>{post.title}</h4>
                            </Link>
                            <p className={`profile-post-status ${post.published ? '' : 'draft'}`}>
                                Durum: {post.published ? 'Yayınlandı' : 'Taslak'}
                            </p>
                            <p className="profile-post-card-date">
                                Oluşturulma: {new Date(post.created_at).toLocaleDateString()}
                                {post.updated_at && new Date(post.updated_at).getTime() !== new Date(post.created_at).getTime() && (
                                    <span> (Son Güncelleme: {new Date(post.updated_at).toLocaleDateString()})</span>
                                )}
                            </p>

                            <div className="profile-post-actions">
                                <button
                                    onClick={() => handleEditPost(post.id)}
                                    className="action-button edit-button"
                                    aria-label="Yazıyı Düzenle"
                                    title="Yazıyı Düzenle"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="action-button delete-button"
                                    aria-label="Yazıyı Sil"
                                    title="Yazıyı Sil"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProfilePage;