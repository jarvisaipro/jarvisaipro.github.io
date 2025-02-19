import React from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${props => props.$sender === 'user' ? 'flex-end' : 'flex-start'};
  margin: 8px 0;
`;

const MessageBox = styled.div`
  max-width: 60%;
  padding: 10px;
  border-radius: 8px;
  background-color: ${props => props.$sender === 'user' ? '#2563eb' : '#1a1a1a'};
  color: ${props => props.$sender === 'user' ? '#ffffff' : '#e5e7eb'};
  text-align: left;
`;

const MessageText = styled.div`
  white-space: pre-wrap;
  line-height: 1;
  font-size: 1rem;

  .list-item {
    display: flex;
    margin: 0;
    padding: 0;
    align-items: center;
  }

  .item-name {
    color: #e5e7eb;
    margin-right: 4px;
  }

  .item-value {
    color: #60a5fa;
  }

  .separator {
    margin: 0 4px;
    color: #6b7280;
  }

  p, div {
    margin: 0;
    padding: 0;
  }
`;

const Message = ({ message }) => {
  const formatMessageContent = (content) => {
    if (content.includes('-') || content.includes(':')) {
      const lines = content.split('\n');
      return lines.map((line, index) => {
        if (!line.trim()) return '';

        let [name, value] = ['', ''];
        let separator = '';

        if (line.includes(' - ')) {
          [name, value] = line.split(' - ');
          separator = '-';
        } else if (line.includes(' : ')) {
          [name, value] = line.split(' : ');
          separator = ':';
        } else if (line.includes(': ')) {
          [name, value] = line.split(': ');
          separator = ':';
        } else {
          return `${line}\n`;
        }

        return `
          <div class="list-item">${name}<span class="separator">${separator}</span><span class="item-value">${value}</span></div>
        `.trim();
      }).join('\n');
    }

    return content;
  };

  return (
    <MessageContainer $sender={message.role}>
      <MessageBox $sender={message.role}>
        <MessageText
          $sender={message.role}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(formatMessageContent(message.content))
          }}
        />
      </MessageBox>
    </MessageContainer>
  );
};

export default Message; 