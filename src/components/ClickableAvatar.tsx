import React, {type ChangeEvent, useEffect, useRef, useState} from 'react';
import {AxiosError} from 'axios';
import {useAppDispatch, useAppSelector} from '../store/hooks.ts';
import {updateAvatarThunk} from '../features/auth/auth.thunks.ts';
import {axiosSecureInstance} from '../libs/axiosSecureInstance.ts';
import {Avatar} from '@mui/material';

type ClickableAvatarProps = {
  size?: number;
  className?: string;
  uploadToCdnAndGetUrl: (file: File) => Promise<string>;
};

export const ClickableAvatar: React.FC<ClickableAvatarProps> = ({
  size = 44,
  className,
  uploadToCdnAndGetUrl: uploadAvatar,
}) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const user = useAppSelector((s) => s.auth.user);
  const [isUploading, setIsUploading] = useState(false);

  const [backendAvatarUrl, setBackendAvatarUrl] = useState<string | null>(null);

  const fetchBackendAvatar = async () => {
    try {
      const res = await axiosSecureInstance.get('/auth/avatar/show', {
        responseType: 'blob',
        validateStatus: (s) => (s >= 200 && s < 300) || s === 404,
      });

      if (res.status === 404) {
        setBackendAvatarUrl(null);
        return;
      }

      const blob: Blob = res.data;
      if (!blob.type.startsWith('image/')) {
        setBackendAvatarUrl(null);
        return;
      }

      setBackendAvatarUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (error) {
      console.error('Błąd pobierania avatara:', error);
      setBackendAvatarUrl(null);
    }
  };

  useEffect(() => {
    void fetchBackendAvatar();
    return () => {
      setBackendAvatarUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  const openPicker = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  async function onFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      await dispatch(updateAvatarThunk({ avatarUrl })).unwrap();
      await fetchBackendAvatar();
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
  const imgSrc = backendAvatarUrl ?? user?.avatarUrl ?? null;

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
          borderRadius: 100,
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
        {imgSrc ? (
          <Avatar src={imgSrc} alt="avatar image" />
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
          />
        )}
      </button>

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFileSelected} />
    </div>
  );
};
