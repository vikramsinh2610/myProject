import React from 'react';
import { WhatsAppIcon, WhatsAppShareButton } from 'react-share';

interface WhatsAppShareButtonProps {
  url: string;
  label: string;
  superscript: string;
}

const WhatsAppShareWithSuperscript: React.FC<WhatsAppShareButtonProps> = ({
  url,
  label,
  superscript,
}) => {
  const text = `${label} ${superscript}`;

  return (
    <WhatsAppShareButton url={url} title={text}>
      <WhatsAppIcon size={32} round />
    </WhatsAppShareButton>
  );
};

export default WhatsAppShareWithSuperscript;
