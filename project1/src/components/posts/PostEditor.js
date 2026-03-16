import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { colors, spacing } from '../../theme';
import postService from '../../services/post.service';

export function PostEditor({
  initialTitle = '',
  initialExcerpt = '',
  initialImageUrl = '',
  initialContent = '',
  initialPublished = false,
  onSubmit,
  submitting,
  error,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [content, setContent] = useState(initialContent);
  const [published, setPublished] = useState(initialPublished);
  const [mode, setMode] = useState('edit'); // edit | preview
  const [imageMode, setImageMode] = useState('url'); // url | file
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      excerpt,
      imageUrl,
      content,
      published,
    });
  };

  const wordCount = content ? content.trim().split(/\s+/).length : 0;

  const handleImageUpload = async () => {
    if (!imageFile) {
      setUploadError('Lütfen bir görsel dosyası seçin.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const data = await postService.uploadImage(imageFile);
      if (data && data.url) {
        setImageUrl(data.url);
      }
    } catch (err) {
      setUploadError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            marginBottom: spacing.lg,
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: 8,
            border: `1px solid ${colors.danger}`,
            background: colors.dangerSoft,
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.md,
          fontSize: '0.85rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
          }}
        >
          <button
            type="button"
            onClick={() => setMode('edit')}
            style={{
              padding: '4px 10px',
              borderRadius: 9999,
              border:
                mode === 'edit'
                  ? `1px solid ${colors.primary}`
                  : `1px solid ${colors.borderSubtle}`,
              backgroundColor:
                mode === 'edit' ? colors.primarySoft : 'transparent',
              color: colors.textPrimary,
              cursor: 'pointer',
            }}
          >
            Düzenle
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            style={{
              padding: '4px 10px',
              borderRadius: 9999,
              border:
                mode === 'preview'
                  ? `1px solid ${colors.primary}`
                  : `1px solid ${colors.borderSubtle}`,
              backgroundColor:
                mode === 'preview' ? colors.primarySoft : 'transparent',
              color: colors.textPrimary,
              cursor: 'pointer',
            }}
          >
            Önizleme
          </button>
        </div>

        <span style={{ color: colors.textMuted }}>
          Yaklaşık kelime sayısı: {wordCount}
        </span>
      </div>

      {mode === 'edit' ? (
        <>
          <Input
            id="title"
            label="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            id="excerpt"
            label="Özet (opsiyonel)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            helperText="Liste görünümünde gözükecek kısa açıklama."
          />
          <div
            style={{
              marginBottom: spacing.lg,
              padding: spacing.md,
              borderRadius: 12,
              border: `1px solid ${colors.borderSubtle}`,
              backgroundColor: '#020617',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.sm,
                fontSize: '0.85rem',
              }}
            >
              <span style={{ color: colors.textMuted }}>
                Kapak görseli (opsiyonel)
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: spacing.xs,
                }}
              >
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 9999,
                    border:
                      imageMode === 'url'
                        ? `1px solid ${colors.primary}`
                        : `1px solid ${colors.borderSubtle}`,
                    backgroundColor:
                      imageMode === 'url' ? colors.primarySoft : 'transparent',
                    color: colors.textPrimary,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 9999,
                    border:
                      imageMode === 'file'
                        ? `1px solid ${colors.primary}`
                        : `1px solid ${colors.borderSubtle}`,
                    backgroundColor:
                      imageMode === 'file'
                        ? colors.primarySoft
                        : 'transparent',
                    color: colors.textPrimary,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                >
                  Dosya
                </button>
              </div>
            </div>

            {imageMode === 'url' ? (
              <Input
                id="imageUrl"
                label="Kapak görseli URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                helperText="Dış bir URL verebilir veya boş bırakabilirsin."
              />
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(e.target.files ? e.target.files[0] : null)
                  }
                  style={{ marginBottom: spacing.sm }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{ color: colors.textMuted }}>
                    Maksimum 5MB, sadece görsel dosyalar.
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleImageUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                  </Button>
                </div>
                {uploadError && (
                  <div
                    style={{
                      marginTop: spacing.xs,
                      fontSize: '0.8rem',
                      color: colors.textDanger,
                    }}
                  >
                    {String(uploadError)}
                  </div>
                )}
              </div>
            )}

            {imageUrl && (
              <div
                style={{
                  marginTop: spacing.sm,
                  fontSize: '0.8rem',
                  color: colors.textMuted,
                }}
              >
                Seçili görsel: <code>{imageUrl}</code>
              </div>
            )}
          </div>
          <TextArea
            id="content"
            label="İçerik"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              marginBottom: spacing.xl,
              fontSize: '0.9rem',
            }}
          >
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <label htmlFor="published">Yayımla</label>
          </div>
        </>
      ) : (
        <div
          style={{
            borderRadius: 12,
            border: `1px solid ${colors.borderSubtle}`,
            padding: spacing.lg,
            backgroundColor: '#020617',
            marginBottom: spacing.xl,
          }}
        >
          {imageUrl && (
            <div
              style={{
                marginBottom: spacing.md,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <img
                src={imageUrl}
                alt={title || 'Önizleme görseli'}
                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              />
            </div>
          )}
          <h1 style={{ marginTop: 0, marginBottom: spacing.sm }}>{title}</h1>
          {excerpt && (
            <p
              style={{
                marginTop: 0,
                marginBottom: spacing.lg,
                color: colors.textMuted,
              }}
            >
              {excerpt}
            </p>
          )}
          <div
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              fontSize: '0.95rem',
            }}
          >
            {content}
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: spacing.sm,
        }}
      >
        <Button type="submit" disabled={submitting}>
          {submitting ? 'İşleniyor...' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}

