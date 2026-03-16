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
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { colors, spacing } from '../theme';

function ProfilePage() {
    // `id` useParams'tan geliyordu, ancak biz artık currentUser.id kullanacağız
    // Dolayısıyla `id`'ye ihtiyacımız yok
    // const { id } = useParams(); // <-- BU SATIRI YORUM SATIRI YAP VEYA SİL
    const { currentUser, loading: authLoading, logout } = useAuth(); // logout'u da ekledik
    const [profileUser, setProfileUser] = useState(null);
    const [stats, setStats] = useState({ totalPosts: 0, publishedPosts: 0, draftPosts: 0 });
    const [userPosts, setUserPosts] = useState([]);
    const [filter, setFilter] = useState('all'); // all | published | draft
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
                setStats({
                    totalPosts: Number(data.stats?.totalPosts || 0),
                    publishedPosts: Number(data.stats?.publishedPosts || 0),
                    draftPosts: Number(data.stats?.draftPosts || 0),
                });
                setUserPosts(data.posts || []);
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
        return (
            <div style={{ paddingTop: spacing.xl }}>
                <Card>
                    <div>Profil bilgileri yükleniyor...</div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ paddingTop: spacing.xl }}>
                <Card
                    style={{
                        borderColor: colors.danger,
                        background: colors.dangerSoft,
                    }}
                >
                    <div>Hata: {error}</div>
                </Card>
            </div>
        );
    }

    // currentUser'ın varlığını zaten useEffect başında kontrol ettik.
    // profileUser'ın null olması durumunu da burada ele alabiliriz.
    if (!profileUser) {
        return (
            <div style={{ paddingTop: spacing.xl }}>
                <Card>
                    <div>Profil bulunamadı veya yüklenemedi.</div>
                </Card>
            </div>
        );
    }

    const filteredPosts = userPosts.filter((post) => {
        if (filter === 'published') {
            return post.status === 'published';
        }
        if (filter === 'draft') {
            return post.status === 'draft';
        }
        return true;
    });

    const displayName = profileUser.display_name || profileUser.username;
    const initials = (displayName || profileUser.username || '?')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div style={{ paddingTop: spacing.xl }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)',
                    gap: spacing.xl,
                }}
            >
                <Card>
                    <h2 style={{ marginTop: 0, marginBottom: spacing.sm }}>
                        Profilim
                    </h2>
                    <p
                        style={{
                            margin: 0,
                            marginBottom: spacing.md,
                            fontSize: '0.9rem',
                            color: colors.textMuted,
                        }}
                    >
                        Hesap bilgilerin ve yazı istatistiklerin.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: spacing.lg,
                            marginTop: spacing.lg,
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                flexShrink: 0,
                                width: 72,
                                height: 72,
                                borderRadius: '50%',
                                backgroundColor: '#020617',
                                border: `1px solid ${colors.borderSubtle}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                overflow: 'hidden',
                            }}
                        >
                            {profileUser.avatar_url ? (
                                <img
                                    src={profileUser.avatar_url}
                                    alt={displayName}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: spacing.xs,
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                    }}
                                >
                                    {displayName}
                                </div>
                                <div
                                    style={{
                                        fontSize: '0.8rem',
                                        color: colors.textMuted,
                                    }}
                                >
                                    @{profileUser.username}
                                </div>
                            </div>
                            <div
                                style={{
                                    fontSize: '0.85rem',
                                    color: colors.textMuted,
                                }}
                            >
                                {profileUser.bio ||
                                    'Henüz bir bio eklemedin. Kendini kısaca tanıtabilirsin.'}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: spacing.md,
                            marginTop: spacing.lg,
                            fontSize: '0.85rem',
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                padding: spacing.sm,
                                borderRadius: 10,
                                border: `1px solid ${colors.borderSubtle}`,
                                backgroundColor: '#020617',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '0.75rem',
                                    color: colors.textMuted,
                                }}
                            >
                                Toplam yazı
                            </div>
                            <div style={{ fontSize: '1rem' }}>
                                {stats.totalPosts}
                            </div>
                        </div>
                        <div
                            style={{
                                flex: 1,
                                padding: spacing.sm,
                                borderRadius: 10,
                                border: `1px solid ${colors.borderSubtle}`,
                                backgroundColor: '#020617',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '0.75rem',
                                    color: colors.textMuted,
                                }}
                            >
                                Yayınlanan
                            </div>
                            <div style={{ fontSize: '1rem' }}>
                                {stats.publishedPosts}
                            </div>
                        </div>
                        <div
                            style={{
                                flex: 1,
                                padding: spacing.sm,
                                borderRadius: 10,
                                border: `1px solid ${colors.borderSubtle}`,
                                backgroundColor: '#020617',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '0.75rem',
                                    color: colors.textMuted,
                                }}
                            >
                                Taslak
                            </div>
                            <div style={{ fontSize: '1rem' }}>
                                {stats.draftPosts}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: spacing.xl }}>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate('/create-post')}
                        >
                            Yeni yazı oluştur
                        </Button>
                        {/* İleri faz: Profili düzenle formu için sadece UI taslağı */}
                        <Button
                            variant="ghost"
                            fullWidth
                            style={{ marginTop: spacing.sm, fontSize: '0.8rem' }}
                            type="button"
                        >
                            Profili düzenle
                        </Button>
                    </div>
                </Card>

                <div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: spacing.md,
                        }}
                    >
                        <h3 style={{ margin: 0 }}>Yazdıklarım</h3>
                        <div
                            style={{
                                display: 'flex',
                                gap: spacing.sm,
                                fontSize: '0.8rem',
                            }}
                        >
                            {[
                                { id: 'all', label: 'Tümü' },
                                { id: 'published', label: 'Yayınlanan' },
                                { id: 'draft', label: 'Taslak' },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setFilter(f.id)}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: 9999,
                                        border:
                                            filter === f.id
                                                ? `1px solid ${colors.primary}`
                                                : `1px solid ${colors.borderSubtle}`,
                                        backgroundColor:
                                            filter === f.id
                                                ? colors.primarySoft
                                                : 'transparent',
                                        color: colors.textPrimary,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {userPosts.length === 0 ? (
                        <Card>
                            <p
                                style={{
                                    margin: 0,
                                    color: colors.textMuted,
                                }}
                            >
                                Henüz hiç yazı yazmadın. Başlamak için sağdaki
                                \"Yeni yazı oluştur\" butonunu kullanabilirsin.
                            </p>
                        </Card>
                    ) : filteredPosts.length === 0 ? (
                        <Card>
                            <p
                                style={{
                                    margin: 0,
                                    color: colors.textMuted,
                                }}
                            >
                                Bu filtre için gösterilecek yazı yok.
                            </p>
                        </Card>
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: spacing.md,
                            }}
                        >
                            {filteredPosts.map((post) => (
                                <Card
                                    key={post.id}
                                    style={{
                                        padding: spacing.lg,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            gap: spacing.lg,
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <Link
                                                to={`/posts/${post.id}`}
                                                style={{
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <h4
                                                    style={{
                                                        margin: 0,
                                                        marginBottom:
                                                            spacing.xs,
                                                    }}
                                                >
                                                    {post.title}
                                                </h4>
                                            </Link>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    marginBottom: spacing.xs,
                                                    fontSize: '0.8rem',
                                                    color: colors.textMuted,
                                                }}
                                            >
                                                Durum:{' '}
                                                <span
                                                    style={{
                                                        color:
                                                            post.status ===
                                                            'published'
                                                                ? colors.success
                                                                : colors.textMuted,
                                                    }}
                                                >
                                                    {post.status === 'published'
                                                        ? 'Yayınlandı'
                                                        : 'Taslak'}
                                                </span>
                                            </p>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: '0.8rem',
                                                    color: colors.textMuted,
                                                }}
                                            >
                                                Oluşturulma:{' '}
                                                {new Date(
                                                    post.created_at,
                                                ).toLocaleDateString()}
                                                {post.updated_at &&
                                                    new Date(
                                                        post.updated_at,
                                                    ).getTime() !==
                                                        new Date(
                                                            post.created_at,
                                                        ).getTime() && (
                                                        <span>
                                                            {' '}
                                                            (Son
                                                            güncelleme:{' '}
                                                            {new Date(
                                                                post.updated_at,
                                                            ).toLocaleDateString()}
                                                            )
                                                        </span>
                                                    )}
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                gap: spacing.sm,
                                            }}
                                        >
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    handleEditPost(post.id)
                                                }
                                                title="Yazıyı düzenle"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    handleDeletePost(post.id)
                                                }
                                                title="Yazıyı sil"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrashAlt}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;