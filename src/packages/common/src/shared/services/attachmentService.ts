import { doFetch } from '../../utils';

type DownloadAttachmentRequest = {
  path: string;
};

export type DownloadAttachmentResponse = {
  uri: string;
};

type UploadAttachmentType = {
  filePath: string;
};

const downloadAttachment = async (
  path: string
): Promise<DownloadAttachmentResponse> => {
  return doFetch<void, DownloadAttachmentResponse, DownloadAttachmentRequest>({
    url: 'chatFile',
    method: 'GET',
    queryString: {
      path
    }
  });
};

const uploadAttachment = async (uri: string): Promise<UploadAttachmentType> => {
  const uriParts = uri.split('.');
  const fileType = uriParts[uriParts.length - 1];

  const formData = new FormData();

  formData.append('file', {
    uri,
    name: `recording.${fileType}`,
    type: `audio/x-${fileType}`
  });

  return doFetch({
    url: 'chatFile',
    method: 'POST',
    request: formData,
    withStringify: false,
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
};

export { downloadAttachment, uploadAttachment };
