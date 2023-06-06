import type { AppProps } from "next/app";
import "./App.css"
import { Configuration, OpenAIApi } from "openai";
import getConfig from "next/config";
import { error } from "console";
import { useState, useEffect } from "react";
import { text } from "stream/consumers";
import { url } from "inspector";

export default function App({ Component, pageProps }: AppProps) {

  const [result, setResult] = useState("https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const text = "Generate Image.... Please wait... ";
  const [typedText, setTypedText] = useState(text);

  const { publicRuntimeConfig } = getConfig();
  const apiKey = (typeof publicRuntimeConfig !== 'undefined' && publicRuntimeConfig.apiKey) ? publicRuntimeConfig.apiKey : process.env.API_KEY;
  if(!apiKey) {
    throw new Error('apiKey is not defined in config file')
  }
  
  const configuration = new Configuration({apiKey});
  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setLoading(true);
    const res = await openai.createImage ({
      prompt:prompt,
      n:1,
      size:"512x512"
    })
    setLoading(false);
    const data = res.data;    //console.log(data);    
    setResult(data.data[0].url || 'No image found!' );
  }

  useEffect(() => {

    if (loading) {
      let i = 0;
      const typing = setInterval(() => {
        setTypedText(text.slice(0, i));
        i++;
        if (i > text.length + 1) {
          i = 0;
          setTypedText('');          
        }
    },200);
    return () => clearInterval(typing);
  }
  },[loading])

  const sendEmail = (url ="") => {
    url = result;
    const message = `Hi, I have created an image with my mind. Please check it out here: ${url}`;
    window.location.href = `mailto:?subject=I have created an image with my mind&body=${message}`;
  }

  return <div className="app-main">
      <h2>Create images with your mind!</h2>
      <textarea
        className="app-input"
        placeholder="Create any type of image you can think of with as much added description as you like"
        onChange={(e)=> setPrompt(e.target.value)}

      />
      <button onClick={generateImage}>Generate Image</button>
      <>{loading ? (
      <>
      <h3>{typedText}</h3>
      <div className="lds-ripple">
        <div></div>
        <div>        
        </div>
      </div>
      </>
      )
      :  <img src={result} onClick={() => sendEmail(result)} style={{cursor: "pointer"}} className="result-image" alt="result" />
      }              
      </>
    </div>
  }
