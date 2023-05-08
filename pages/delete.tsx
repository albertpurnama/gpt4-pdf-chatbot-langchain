import { useEffect, useState } from "react";

type DBDocument = {
  id: string;
  metadata: {
    fileName: string;
    dbId: string;
  }
}

function DeletePage() {
  const [documentList, setDocumentList] = useState<Array<DBDocument>>();

  useEffect(() => {
    fetch('/api/document/list').then((resp) => resp.json()).then((data) => {
      setDocumentList(data.documents as Array<DBDocument>);
    });
  }, [])

  if(!documentList) {
    return (<div>Loading..</div>)
  }
  
  return (
    <div>
      <h1>Delete Page</h1>
      {documentList?.map((doc) => {
        console.log(doc);
        return (
          <div key={JSON.stringify(doc)}>
            <h2>{doc.metadata.fileName || 'Untitled'}</h2>
            <button onClick={() => {
              fetch(`/api/document/delete/${doc.id}`, {
                method: 'DELETE',
              });
            }}>Delete</button>
          </div>
        )
      })}
    </div>
  )
}

export default DeletePage;
