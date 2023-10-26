import React from 'react';

interface Props {
  linkUrl: string;
  linkText: string;
  superscriptText: string;
}

const SuperscriptLink: React.FC<Props> = ({ linkUrl, linkText, superscriptText }) => {
  return (
    <p>
      <a href={linkUrl}>{linkText}</a>
      <sup>{superscriptText}</sup>
    </p>
  );
};

export default SuperscriptLink;