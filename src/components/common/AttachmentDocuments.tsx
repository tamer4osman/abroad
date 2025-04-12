import React, { ChangeEvent } from 'react';


interface AttachmentData {
    id: string;
    type: string;
    file: File;
  }
  
  interface AttachmentDocumentsProps {
    uploadedAttachments: AttachmentData[];
    onAttachmentTypeChange: (id: string, type: string) => void;
    onRemoveAttachment: (id: string) => void;
    onAttachmentUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    attachmentTypeOptions?: readonly { value: string; label: string }[];
  };
  

  const AttachmentDocuments: React.FC<AttachmentDocumentsProps> = ({
    uploadedAttachments,
    onAttachmentTypeChange,
    onRemoveAttachment,
    onAttachmentUpload,
    attachmentTypeOptions = [{ value: "type1", label: "Type 1" }, { value: "type2", label: "Type 2" }],
  }) => {
    return (
      <>
        <input type="file" onChange={onAttachmentUpload} />
        <AttachmentTable
          attachments={uploadedAttachments}
          onTypeChange={onAttachmentTypeChange}
          onRemove={onRemoveAttachment}
          attachmentTypeOptions={attachmentTypeOptions}
        />
      </>
    );
  };
  
  interface AttachmentTableProps {
    attachments: AttachmentData[];
    onTypeChange: (id: string, newType: string) => void;
    onRemove: (id: string) => void;
    attachmentTypeOptions: readonly { value: string; label: string }[];
  }

  
  const AttachmentTable: React.FC<AttachmentTableProps> = ({
    attachments,
    onTypeChange,
    onRemove,
    attachmentTypeOptions,
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
        {attachments.map((attachment) => (
                <tr key={attachment.id}>
                <td>{attachment.file.name}</td>
                <td>
                  <select
                    value={attachment.type}
                    onChange={(e) => onTypeChange(attachment.id, e.target.value)}
                  >
                    {attachmentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
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
