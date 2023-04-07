import React, { useState, useEffect } from "react";
import { useSpotify } from "../../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const notifyAboutLike = () => toast("Added to Liked Songs");
const notifyAboutDeletion = () => toast("Removed from Liked Songs");

const LikeButton = ({ itemId, saved }: { itemId: string; saved: boolean }) => {
  const [isSaved, setIsSaved] = useState(false);

  const { checkIfSaved, changeSaved } = useSpotify();

  const deleteSaved = () => {
    changeSaved(itemId, "DELETE");
    notifyAboutDeletion();
    setIsSaved(false);
  };

  const addSaved = () => {
    changeSaved(itemId, "PUT");
    notifyAboutLike();
    setIsSaved(true);
  };

  const handleSavedClick = () => {
    isSaved ? deleteSaved() : addSaved();
  };

  useEffect(() => {
    if (saved) {
      setIsSaved(saved);
    }
  }, [saved]);

  return (
    <button onClick={() => handleSavedClick()}>
      <AnimatePresence>
        <motion.div className="saved_button">
          {isSaved ? (
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 150 150"
              className="saved_icon"
              animate={{ scale: [1, 1.3, 1] }}
            >
              <path d="M 125.784 35.0369 C 113.039 22.2916 92.9859 21.3682 79.1227 32.8994 C 79.1062 32.9135 77.318 34.3807 75 34.3807 C 72.6234 34.3807 70.9266 32.9416 70.8609 32.8853 C 57.0141 21.3682 36.9609 22.2916 24.2156 35.0369 C 17.6695 41.583 14.0625 50.2877 14.0625 59.5478 C 14.0625 68.808 17.6695 77.5127 24.0914 83.9228 L 64.3078 131.006 C 66.9844 134.14 70.882 135.938 75 135.938 C 79.1203 135.938 83.0156 134.14 85.6922 131.009 L 125.782 84.0611 C 139.301 70.5447 139.301 48.5533 125.784 35.0369 Z" />
            </motion.svg>
          ) : (
            <motion.svg
              animate={{ scale: [1, 0.7, 1] }}
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 150 150"
              className="saved_icon"
            >
              <path d="M125.784 35.0369C113.039 22.2916 92.9859 21.3682 79.1227 32.8994C79.1062 32.9135 77.318 34.3807 75 34.3807C72.6234 34.3807 70.9266 32.9416 70.8609 32.8853C57.0141 21.3682 36.9609 22.2916 24.2156 35.0369C17.6695 41.583 14.0625 50.2877 14.0625 59.5478C14.0625 68.808 17.6695 77.5127 24.0914 83.9228L64.3078 131.006C66.9844 134.14 70.882 135.938 75 135.938C79.1203 135.938 83.0156 134.14 85.6922 131.009L125.782 84.0611C139.301 70.5447 139.301 48.5533 125.784 35.0369ZM122.346 80.8807L82.1297 127.964C80.3461 130.05 77.7469 131.25 75 131.25C72.2531 131.25 69.6562 130.053 67.8703 127.964L27.532 80.7447C21.8695 75.0822 18.75 67.5541 18.75 59.5478C18.75 51.5392 21.8695 44.0135 27.5297 38.351C33.3961 32.4822 41.0555 29.5127 48.7336 29.5127C55.4742 29.5127 62.2289 31.8025 67.7977 36.4338C68.0977 36.7033 70.8586 39.0682 75 39.0682C79.0266 39.0682 81.8578 36.7314 82.1367 36.49C94.1109 26.5291 111.45 27.3307 122.47 38.351C134.159 50.0393 134.159 69.0564 122.346 80.8807Z" />
            </motion.svg>
          )}

          {isSaved ? (
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
              LIKED
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              LIKE
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default LikeButton;
