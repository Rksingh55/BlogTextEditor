import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import FileInputWithPreview from './image-picker-views';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { serverURI } from './const';
import { toast } from 'react-toastify';
import './style.css';
import { getKebabConvert } from './utlis/common-func';
import { useLoader } from './utlis/hooks/useLoader';

export const EditorCode = () => {
  const [texts, setTexts] = useState({ title: '', description: '' });
  const [bannerFile, setBannerFile] = useState(null);
  const [tags, setTags] = useState({ list: [], text: '' });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [openLoader, closeLoader, LoaderCMP] = useLoader();

  const saveBlog = async () => {
    try {
      const blog = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      if (
        texts?.title.length <= 0 ||
        texts?.description.length <= 0 ||
        tags.list?.length <= 0 ||
        !blog
      ) {
        return window.alert('Enter Valid Fields!');
      }
      openLoader('Saving Your Blog!');
      const {
        data: { link: bannerLink },
      } = await uploadImageCallback(bannerFile);
      const toSave = {
        ...texts,
        tagList: tags.list,
        blog: blog,
        bannerLink,
      };
      fetch(`${serverURI}/api/super-admin/content/save-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toSave),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data?.status) {
            closeLoader();
            return toast.error(data?.message);
          }
          window.navigator.clipboard.writeText(data?.data?.blogLink);
          window.confirm(`Copy Link : ${data?.data?.blogLink}`);
          closeLoader();
          return toast.success(data?.message);
        })
        .catch((error) => {
          console.log('error ', error);
          window.alert('Error: Check Your Internet Connection!');
          closeLoader();
        });
    } catch (error) {
      toast('Not Able To Continue!');
      closeLoader();
    }
  };

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const uploadImageCallback = (selectedImage) => {
    return new Promise(async (resolve, reject) => {
      if (!selectedImage) {
        toast('No image selected!');
        reject('No image selected');
        return;
      }

      if (selectedImage.size > 150 * 1024) {
        toast('Image size exceeds 150 KB');
        reject('Image size exceeds 150 KB');
        return;
      }

      if (selectedImage.type !== 'image/webp') {
        toast('Invalid image format. Only webP files are allowed.');
        reject('Invalid image format. Only webP files are allowed.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('image', selectedImage);
        const response = await fetch(
          `${serverURI}/api/super-admin/progams/get-image-url`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          resolve({
            data: {
              link: data.data,
            },
          });
        } else {
          reject('error');
        }
      } catch (error) {
        reject('error');
      }
    });
  };

  return (
    <>
      <LoaderCMP />
      <br />
      <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        wrapperStyle={{}}
        editorStyle={{ padding: 12, marginBottom: 20 }}
        toolbarStyle={{ position: 'sticky', top: 0, zIndex: 100 }}
        onEditorStateChange={onEditorStateChange}
        placeholder="Write your blog content here!"
        toolbar={{
          image: {
           
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: true,
            uploadCallback: uploadImageCallback,
            previewImage: true,
            inputAccept: 'image/webp',
            alt: { present: true, mandatory: true },
            defaultSize: {
              height: 'auto',
              width: 'auto',
            },
          },
        }}
      />
      <FileInputWithPreview
        getFile={(file) => {
          setBannerFile(file);
        }}
      />
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <h3 style={{ width: 120 }}>Title : </h3>
        <input
          className="inputdata"
          style={{ flex: 1, margin: 0 }}
          value={texts?.title}
          placeholder="Title"
          onChange={(e) => {
            setTexts({ ...texts, title: e.target.value });
          }}
        />
      </div>
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <h3 style={{ width: 120 }}>Description : </h3>
        <textarea
          className="inputdata"
          style={{ flex: 1, margin: 0 }}
          value={texts?.description}
          placeholder="Description"
          onChange={(e) => {
            setTexts({ ...texts, description: e.target.value });
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '12px 0px 12px 0px',
        }}
      >
        <h3 style={{ width: 120 }}>URL : </h3>
        <p>{`easyhaionline.com/blog/${getKebabConvert(
          texts?.title
        )}-blogId`}</p>
      </div>
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <h3 style={{ width: 120 }}>Tag/Keyword Items : </h3>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {tags.list?.map((tag, index) => (
              <div
                style={{
                  margin: '5px',
                  border: '1px solid #eee',
                  textAlign: 'center',
                  padding: '2px',
                }}
                key={index}
              >
                <p>{tag}</p>
                <button
                  className="saveblog"
                  onClick={() => {
                    setTags((prevTags) => ({
                      ...prevTags,
                      list: prevTags.list.filter((_, i) => i !== index),
                    }));
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div>
            <input
              className="inputdata"
              style={{ width: '20%' }}
              value={tags.text}
              placeholder="Tags"
              onChange={(e) => {
                setTags((prevTags) => ({ ...prevTags, text: e.target.value }));
              }}
            />
            <button
              style={{ margin: '5px', padding: '12px 30px' }}
              className="saveblog"
              onClick={() => {
                setTags((prevTags) => ({
                  ...prevTags,
                  list: [...prevTags.list, prevTags.text],
                  text: '',
                }));
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}
      >
        <button
          style={{ margin: '5px', padding: '12px 30px' }}
          onClick={saveBlog}
          className="saveblog"
        >
          Save Blog
        </button>
      </div>
    </>
  );
};
