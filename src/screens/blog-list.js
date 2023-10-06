import React, { useEffect, useState } from 'react';
import useModalHook from '../components/modalHook';
import { serverURI } from '../const';
import { toast } from 'react-toastify';
import { getKebabConvert } from '../utlis/common-func';

export default function BlogsList() {
  const [list, setList] = useState(null);
  const { openModal, closeModal, Modal } = useModalHook();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const fetchFirst = () => {
    fetch(`${serverURI}/api/super-admin/content/blog-list?page=1`)
      .then((response) => response.json())
      .then(({ data, status, message }) => {
        if (!status) {
          return toast.error(message);
        } else {
          setList(data);
        }
      })
      .catch((error) => {
        console.error('Error saving blog:', error);
      });
  };

  useEffect(() => {
    fetchFirst();
  }, []);

  return (
    <div>
      <Modal>
        <div
          style={{ backgroundColor: '#fff', padding: 20 }}
          className="modall"
        >
          {selectedBlog && (
            <>
              <h1>{selectedBlog?.title}</h1>
              <div>
                <div
                  dangerouslySetInnerHTML={{ __html: selectedBlog?.content }}
                />
              </div>
            </>
          )}
          <div>
            <button onClick={closeModal} className="saveblog">
              Close
            </button>
          </div>
        </div>
      </Modal>
      {/* <h1 className="allblogs">All Blogs</h1> */}
      {list?.map((blog, idx) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #000',
              marginTop: 4,
              padding: '4px 12px',
            }}
          >
            <h3 style={{ flex: 1, padding: 0, margin: 0 }}>
              {idx + 1}.) {blog?.title}
            </h3>
            <div>
              <button
                onClick={() => {
                  setSelectedBlog(blog);
                  openModal();
                }}
              >
                View
              </button>
              <button
                style={{ marginLeft: 12 }}
                onClick={() => {
                  const blogLink = `https://www.easyhaionline.com/blog/${getKebabConvert(
                    blog?.title
                  )}-${blog?.blogId}`;
                  window.navigator.clipboard.writeText(blogLink);
                  toast.success('Successfully Copied!');
                }}
              >
                Copy
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
