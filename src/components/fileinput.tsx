import React, {useRef} from "react";
import {parseFileData} from "../ml/utils.ts";

export function Upload({ uploadCallback }: { uploadCallback: () => void }) {
  const fileRef  = useRef<HTMLInputElement>(null);

  const readFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target === null || event.target.files === null) {
      return
    }

    fileReader.readAsText(event.target.files[0], "UTF-8");
    /**
     * Sets `fileReader.onload` to a callback that parses
     * file data and uploads the resulting words.
     *
     * @param {ProgressEvent<FileReader>} e - The progress
     *     event triggered by reading a file.
     * @return {void}
     */
    fileReader.onload = (e: ProgressEvent<FileReader>): void => {
      const words = parseFileData(e.target?.result as string)
      uploadCallback(words)
    };
  };

  return (
    <>
      <input className={'hidden'} ref={fileRef} type="file" onChange={readFile} />
      <button className={'button button--primary bg-blue-700 text-white rounded py-2 px-4 m-2'}  onClick={()=>fileRef?.current?.click()}>Upload</button>
    </>
  );
}
