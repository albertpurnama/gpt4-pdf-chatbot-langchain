function UploadHome() {

  return (
    <form 
      className="flex flex-col gap-4"
      encType="multipart/form-data"
      method="post"
      action="/api/document/upload"
      onSubmit={(e) => {
        console.log(e.target);
        const formData = new FormData(e.target as HTMLFormElement);
        fetch('/api/document/upload', {
          method: 'POST',
          body: formData,
        })
        e.preventDefault();
      }}
    >
      <h1>This is a form</h1>
      <input type="file" name="file" id='some-id' accept="application/pdf" />
      <input type="submit" />
    </form>
  )
}

export default UploadHome;