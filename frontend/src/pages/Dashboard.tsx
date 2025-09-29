
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wand2, Loader2 } from "lucide-react"; // icons

import show from "../assets/dashboard/show.png";
import {
  getNotes,
  createNoteAPI,
  deleteNoteAPI,
  updateNoteAPI,
  shareNoteAPI,
  getNoteSuggestionAPI // AI suggestion API
} from "../services/operations/notesApi";
import { FiShare2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();

  const [ownNotes, setOwnNotes] = useState<any[]>([]);
  const [sharedNotes, setSharedNotes] = useState<any[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [shareEmails, setShareEmails] = useState(""); // comma-separated emails
  const [isEditingAllowed, setIsEditingAllowed] = useState(true); // own vs shared note
  const [isGeneratingAI, setIsGeneratingAI] = useState(false); // loading state for AI

  // Fetch notes on load
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getNotes(token);
        if (res.success) {
          setOwnNotes(res.ownNotes);
          setSharedNotes(res.sharedNotes);
        }
      } catch (error) {
        console.error("Failed to fetch notes: ", error);
      }
    };
    fetchNotes();
  }, [token]);

  // Create or Edit Note
  const handleSaveNote = async () => {
    try {
      if (!isEditingAllowed) return; // Prevent editing shared notes

      if (selectedNote) {
        const res = await updateNoteAPI(
          selectedNote._id,
          { title: newNote.title, content: newNote.content },
          token
        );

        if (res.success) {
          setOwnNotes(prev => prev.map(n => n._id === selectedNote._id ? res.note : n));
          setSelectedNote(null);
          setNewNote({ title: "", content: "" });
          setIsModalOpen(false);
        }
      } else {
        const res = await createNoteAPI({ title: newNote.title, content: newNote.content }, token);
        if (res.success) {
          setOwnNotes(prev => [res.note, ...prev]);
          setNewNote({ title: "", content: "" });
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  // Delete Note
  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await deleteNoteAPI(noteId, token);
      if (res.success) {
        setOwnNotes(prev => prev.filter(note => note._id !== noteId));
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // Open own note modal
  const handleNoteClick = (note: any) => {
    setSelectedNote(note);
    setNewNote({ title: note.title, content: note.content });
    setIsEditingAllowed(true); // Allow editing for own notes
    setIsModalOpen(true);
  };

  // Open shared note modal (view-only)
  const handleSharedNoteClick = (note: any) => {
    setSelectedNote(note);
    setNewNote({ title: note.title, content: note.content });
    setIsEditingAllowed(false); // Disable editing for shared notes
    setIsModalOpen(true);
  };

  // Open share modal
  const handleShareClick = (note: any) => {
    setSelectedNote(note);
    setShareEmails(note.sharedWith?.join(", ") || "");
    setIsShareModalOpen(true);
  };

  // Share note
  const handleShareNote = async () => {
    try {
      const emails = shareEmails.split(",").map(e => e.trim()).filter(Boolean);
      if (emails.length === 0) return;

      const res = await shareNoteAPI(selectedNote._id, emails, token);
      if (res.success) {
        // Update sharedWith array in ownNotes
        setOwnNotes(prev => prev.map(n => n._id === selectedNote._id ? { ...n, sharedWith: emails } : n));
        setIsShareModalOpen(false);
        setSelectedNote(null);
        setShareEmails("");
      }
    } catch (error) {
      console.error("Failed to share note:", error);
    }
  };

  // Generate AI suggestion
  const handleGenerateAI = async () => {
    if (!newNote.content.trim()) return; // Only generate if content exists
    setIsGeneratingAI(true);

    try {
      const suggestion = await getNoteSuggestionAPI(newNote.content, token);

      if (suggestion?.original && suggestion?.suggestions) {
        // Clear content first, then write new data in one go
        setNewNote({
          title: newNote.title,
          content: `${suggestion.original}\n\nSuggestions: ${suggestion.suggestions}`.trim()
        });
      }

    } catch (error) {
      console.error("Failed to generate AI suggestion:", error);
    } finally {
      setTimeout(() => {
        setIsGeneratingAI(false);
      }, 3000);
    }
  };





  return (
    <div className="w-[80%] mx-auto flex flex-col gap-y-3 px-4 py-2 mt-[4rem]">

      {/* Welcome */}
      <div className="relative mt-6">
        <div className="absolute inset-0 bg-gray-400/50 rounded-lg blur-lg"></div>
        <div className="relative flex flex-col gap-y-3 px-4 py-4 rounded-lg shadow-md shadow-gray-400/50 bg-white">
          <p className="text-md md:text-3xl font-bold">Welcome, {user?.name} !</p>
          <p className="text-gray-500 text-sm md:text-xl">Email : {user?.email}</p>
          <p className="text-gray-500 text-sm md:text-xl">
            D.O.B : {user?.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
          </p>
          <p className="text-gray-500 text-sm md:text-xl">Verified : {user?.isVerified ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Create Note Button */}
      <div className="mt-2 h-auto w-full">
        <button
          onClick={() => { setSelectedNote(null); setNewNote({ title: "", content: "" }); setIsEditingAllowed(true); setIsModalOpen(true); }}
          className="px-4 py-2 bg-[#367AFF] w-full h-[3rem] text-white rounded-lg hover:bg-blue-600 transition">
          Create Note
        </button>
      </div>

      {/* Notes */}
      <div className="flex flex-col lg:flex-row gap-3 w-full py-4 mt-2">
        {/* Own Notes */}
        <div className="flex-1 px-2 pb-2 shadow-lg rounded-lg">
          <p className="text-base lg:text-lg font-semibold mb-2">Your Notes</p>
          {ownNotes.length === 0 ? (
            <p className="text-gray-500 text-sm lg:text-base">No notes yet.</p>
          ) : (
            <ul className="space-y-2 max-h-[18rem] overflow-y-auto">
              {ownNotes.map(note => (
                <li key={note._id} className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm lg:text-base">
                  <span>{note.title}</span>
                  <div className="flex items-center gap-x-3 lg:gap-x-4">
                    <span className="text-xs lg:text-sm text-green-600">Owned</span>
                    <FiShare2
                      className="cursor-pointer text-blue-500"
                      onClick={() => handleShareClick(note)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-red-500"
                      onClick={() => handleDeleteNote(note._id)}
                    />
                    <img src={show} alt="show" className="w-4 lg:w-5 cursor-pointer" onClick={() => handleNoteClick(note)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Shared Notes */}
        <div className="flex-1 px-2 pb-2 shadow-lg rounded-lg">
          <p className="text-base lg:text-lg font-semibold mb-2">Shared Notes</p>
          {sharedNotes.length === 0 ? (
            <p className="text-gray-500 text-sm lg:text-base">No shared notes.</p>
          ) : (
            <ul className="space-y-2 max-h-[18rem] overflow-y-auto">
              {sharedNotes.map(item => (
                <li
                  key={item._id}
                  className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer text-sm lg:text-base "
                  onClick={() => handleSharedNoteClick(item)}
                >
                  <span className="w-[10rem]">{item?.title}</span>
                  <span className="text-[0.8rem] text-end w-[90%] md:w-auto lg:text-sm text-purple-600">Shared by {item.ownerName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Create/Edit/View Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg md:w-[35rem] p-6 relative">
            <h2 className="text-xl font-semibold mb-4">
              {isEditingAllowed ? (selectedNote ? "Edit Note" : "Create Note") : "View Note"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              className="w-full border px-3 py-2 mb-3 rounded"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              disabled={!isEditingAllowed}
            />

            <div className="relative">
              <textarea
                placeholder="Content"
                className="w-full min-h-[200px] border px-3 py-2 mb-3 rounded"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                disabled={!isEditingAllowed}
              />
              {/* Loader overlay */}
              {isGeneratingAI && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500 backdrop-blur-sm rounded animate-pulse">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
                    <span className="text-blue-700 font-medium">AI is generating…</span>
                  </div>
                  <p className="text-sm text-yellow-200 mt-1">✨ Sit tight, magic is happening ✨</p>
                </div>
              )}

            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>

              {isEditingAllowed && newNote.content.trim() !== "" && (
                <button
                  onClick={handleGenerateAI}
                  className={`flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${isGeneratingAI ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  disabled={isGeneratingAI}
                >
                  <Wand2 className="w-4 h-4" />
                </button>
              )}

              {isEditingAllowed && (
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-[#367AFF] text-white rounded hover:bg-blue-600"
                >
                  {selectedNote ? "Update" : "Create"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Share Note</h2>
            <textarea
              placeholder="Enter emails, separated by commas"
              className="w-full border px-3 py-2 mb-3 rounded"
              value={shareEmails}
              onChange={(e) => setShareEmails(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleShareNote}
                className="px-4 py-2 bg-[#367AFF] text-white rounded hover:bg-blue-600"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
