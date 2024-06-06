import axios from "axios";
import { useEffect, useState } from "react";

export default function Pdf() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const[allImage,setAllImage] = useState([])

useEffect(()=>{
getUsser()
},[])
  const getUsser = async ()=>{
   try{
    const res = await axios.get("http://localhost:3070/get-files")
    console.log(res.data)
    setAllImage(res.data)
   }
   catch(err){
    console.log(err);
   }
    

}
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);
    try {
      const result = await axios.post("http://localhost:3070/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(result);
  
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const showPdf = (pdf) => {
    window.open(`http://localhost:3070/files/${pdf}`, "_blank");
    // setPdfFile(`http://localhost:5000/files/${pdf}`)
  };

  return (
    <div className="App">
      <h2>Pdf</h2>
      <form className="formStyle" onSubmit={handleSubmit}>
        <h4>Upload file</h4>
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          className="form-control"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      <div>
    {allImage != null && allImage.length > 0 ? (
        allImage.map((ele) => {
            return (
                <>
                <h2 key={ele._id}>{ele.title}</h2>
                <button onClick={()=>showPdf(ele.pdf)}>showPdf</button>
                </>
            );
        })
    ) : (
        <p>No images available</p>
    )}
</div>
    </div>
  );
}
