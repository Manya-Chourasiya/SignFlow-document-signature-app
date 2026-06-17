import { useState, useEffect } from "react";

function App() {
  const [documents, setDocuments] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/docs");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const fetchSignatures = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/signatures");
      const data = await response.json();
      setSignatures(data);
    } catch (error) {
      console.error("Error fetching signatures:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:5000/api/docs/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Upload Response:", data);

      alert("PDF Uploaded Successfully");

      setSelectedFile(null);

      fetchDocuments();
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload Failed");
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchSignatures();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Document Signature App
      </h1>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Upload PDF
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                setSelectedFile(file);
              }
            }}
          />

          <div className="p-2 border rounded">
            <strong>Selected File:</strong>{" "}
            {selectedFile ? selectedFile.name : "None"}
          </div>

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded w-fit hover:bg-blue-700"
          >
            Upload PDF
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-3 gap-6 mb-6">

        {/* Documents */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Documents
          </h2>

          {documents.length === 0 ? (
            <p>No documents found</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc._id}
                onClick={() => setSelectedDoc(doc)}
                className="border p-3 rounded-lg mb-3 cursor-pointer hover:bg-gray-100"
              >
                <p>{doc.fileName}</p>
              </div>
            ))
          )}
        </div>

        {/* PDF Preview */}
        <div className="col-span-2 bg-white p-4 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">
            PDF Preview
          </h2>

          {!selectedDoc ? (
            <p>Select a document to preview</p>
          ) : (
            <iframe
              title="PDF Viewer"
              src={`http://localhost:5000/uploads/${selectedDoc.fileName}`}
              width="100%"
              height="800px"
              className="border rounded"
            />
          )}
        </div>
      </div>

      {/* Signatures */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">
          Saved Signatures
        </h2>

        {signatures.length === 0 ? (
          <p>No signatures found</p>
        ) : (
          <div className="space-y-3">
            {signatures.map((sig) => (
              <div
                key={sig._id}
                className="border p-3 rounded-lg"
              >
                <p>
                  <strong>Signer:</strong> {sig.signer}
                </p>

                <p>
                  <strong>Document ID:</strong> {sig.documentId}
                </p>

                <p>
                  <strong>X:</strong> {sig.x}
                </p>

                <p>
                  <strong>Y:</strong> {sig.y}
                </p>

                <p>
                  <strong>Page:</strong> {sig.page}
                </p>

                <p>
                  <strong>Status:</strong> {sig.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;