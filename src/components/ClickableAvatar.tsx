import React, {type ChangeEvent, useEffect, useRef, useState} from 'react';
import {AxiosError} from 'axios';
import {useAppDispatch, useAppSelector} from '../store/hooks.ts';
import {updateAvatarThunk} from '../features/auth/auth.thunks.ts';
import {axiosSecureInstance} from '../libs/axiosSecureInstance.ts';

type ClickableAvatarProps = {
  size?: number;
  className?: string;
  uploadToCdnAndGetUrl: (file: File) => Promise<string>;
};

export const ClickableAvatar: React.FC<ClickableAvatarProps> = ({ size = 44, className, uploadToCdnAndGetUrl }) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const user = useAppSelector((s) => s.auth.user);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    axiosSecureInstance
      .get('/api/auth/avatar/show', {
        responseType: 'blob',
      })
      .then((response) => {
        console.log('Avatar blob:', response.data);
      })
      .catch((error) => {
        console.error('Błąd pobierania avatara:', error);
      });
  }, []);
  const openPicker = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  async function onFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Dozwolone formaty: JPG/PNG/WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Maksymalny rozmiar pliku: 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const avatarUrl = await uploadToCdnAndGetUrl(file);

      await dispatch(updateAvatarThunk({ avatarUrl })).unwrap();
    } catch (err) {
      const message =
        typeof err === 'string'
          ? err
          : err instanceof AxiosError
            ? (err.response?.data?.message ?? err.message)
            : err instanceof Error
              ? err.message
              : 'Nie udało się zaktualizować avatara';
      alert(message);
    } finally {
      setIsUploading(false);
    }
  }

  const letter = user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className={className}>
      <button
        type="button"
        onClick={openPicker}
        disabled={isUploading}
        title="Change avatar"
        style={{
          width: size,
          height: size,
          borderRadius: 9999,
          border: '1px solid rgba(0,0,0,0.12)',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          position: 'relative',
          background: 'transparent',
          padding: 0,
        }}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span style={{ fontWeight: 700, userSelect: 'none' }}>{letter}</span>
        )}

        {isUploading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.65)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Upload...
          </div>
        )}
      </button>

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFileSelected} />
    </div>
  );
};
