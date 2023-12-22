import React, {Ref, useRef} from "react";
import {parseFileData} from "../ml/utils.ts";

export function Upload({ setWords, uploadCallback }: { setWords: Function, uploadCallback: Function }) {
  const fileRef  = useRef() as Ref<HTMLInputElement>;

  const readFile = (event: Event) => {
    const fileReader = new FileReader();
    if (event.target === null) {
      return
    }
    const { files } = event.target;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = e => {
      const words = parseFileData(e.target?.result as string)
      console.log(words);
      setWords(words);
      uploadCallback()
    };
  };

  return (
    <>
      <input className={'hidden'} ref={fileRef} type="file" onChange={readFile} />
      <button className={'button button--primary bg-blue-700 text-white rounded py-2 px-4 m-2'}  onClick={()=>fileRef?.current?.click()}>Upload</button>
    </>
  );
}
