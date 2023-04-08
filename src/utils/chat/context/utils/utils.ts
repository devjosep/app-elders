import { MessageType } from '../..';

const addPrefixAttachment = (message: string, type: MessageType): string => {
  return `##${type}##${message}`;
};

const removePrefixAttachment = (message: string): string => {
  return message.replace(/(##).+?(##)/g, '');
};

export { addPrefixAttachment, removePrefixAttachment };
