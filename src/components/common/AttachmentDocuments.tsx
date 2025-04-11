import React from 'react';


interface AttachmentData {
    id: string;
    type: string;
    file: File;
  }
  
  interface AttachmentDocumentsProps {
    uploadedAttachments: AttachmentData[];
    onAttachmentTypeChange: (id: string, type: string) => void;
    onRemoveAttachment: (id: string) => void;
  }
  

  const AttachmentDocuments: React.FC<AttachmentDocumentsProps> = ({
    uploadedAttachments,
    onAttachmentTypeChange,
    onRemoveAttachment,
  }) => {
    return (
      <AttachmentTable
        attachments={uploadedAttachments}
        onTypeChange={onAttachmentTypeChange}
        onRemove={onRemoveAttachment}
      />
    );
  };
  
  interface AttachmentTableProps {
    attachments: AttachmentData[];
    onTypeChange: (id: string, newType: string) => void;
    onRemove: (id: string) => void;
  }
  
  
  const AttachmentTable: React.FC<AttachmentTableProps> = ({
    attachments,
    onTypeChange,
    onRemove,
  }) => {
      if (!attachments || attachments.length === 0) {
          return <p>No attachments uploaded.</p>;
      }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {attachments.map((attachment) => {
            return (
                <tr key={attachment.id}>
                <td>{attachment.file.name}</td>
                <td>
                  <select
                    value={attachment.type}
                    onChange={(e) => onTypeChange(attachment.id, e.target.value)}
                  >
                    <option value="type1">Type 1</option>
                    <option value="type2">Type 2</option>
                  </select>
                </td>
                <td><button onClick={() => onRemove(attachment.id)}>Remove</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};



export default AttachmentDocuments;