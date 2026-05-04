import { useEffect, useState } from "react";
import api from "../api/axios";

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/video/${videoId}`);
      setComments(res.data.comments || []);
    } catch (error) {
      console.log("Failed to load comments", error);
    }
  };

  const addComment = async () => {
    if (!token) {
      alert("Login first");
      return;
    }

    if (!text.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      await api.post(
        "/comments",
        {
          videoId,
          text
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setText("");
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.message || "Comment failed");
    }
  };

  const startEditComment = (comment) => {
    setEditingComment(comment);
    setEditText(comment.text);
  };

  const updateComment = async () => {
    if (!editText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      await api.put(
        `/comments/${editingComment._id}`,
        {
          text: editText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEditingComment(null);
      setEditText("");
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const deleteComment = async (id) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchComments();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return (
    <div className="comments">
      <h3>{comments.length} Comments</h3>

      <div className="comment-box">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={addComment}>Post</button>
      </div>

      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <strong>{comment.user?.username || "User"}</strong>
          <p>{comment.text}</p>

          {user?.id === comment.user?._id && (
            <div className="comment-actions">
              <button
                className="comment-edit-btn"
                onClick={() => startEditComment(comment)}
              >
                Edit
              </button>

              <button
                className="comment-delete-btn"
                onClick={() => deleteComment(comment._id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {editingComment && (
        <div className="edit-modal">
          <div className="edit-box">
            <h2>Edit Comment</h2>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Edit your comment"
            />

            <div className="edit-actions">
              <button onClick={updateComment}>Save</button>
              <button
                className="cancel-btn"
                onClick={() => setEditingComment(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comments;