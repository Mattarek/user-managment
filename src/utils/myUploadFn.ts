import { axiosSecureInstance } from '../libs/axiosSecureInstance.ts';

type UploadAvatarResponse = {
  url: string;
};

export async function myUploadFn(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axiosSecureInstance.post<UploadAvatarResponse>('auth/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.url;
}
