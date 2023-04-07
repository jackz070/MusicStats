import React, { useState, useEffect, useRef } from "react";
import { useSpotify } from "../api/api";
import TrackList from "./DisplayTracks/TrackList";
import { motion, AnimatePresence } from "framer-motion";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "./LoadingSpinner";
import { useSpotifyTrackRecommendations } from "../api/useTrackRecommendations";
import SpotifyApi from "spotify-api";

const TrackRecommendations = ({
  seed,
  type,
}: {
  seed: SpotifyApi.UsersTopTracksResponse;
  type: string;
}) => {
  const [showRecommendationsModal, setShowRecommendationsModal] =
    useState(false);
  const [seedValue, setSeedValue] = useState<string[]>([]);
  const {
    fetchTrackRecommendations,
    recommendations,
    fetchingRecommendations,
    setRecommendations,
  } = useSpotifyTrackRecommendations();

  const modal = useRef<Element | HTMLElement>(null);

  const handleRecommendationsModalOpen = async () => {
    setShowRecommendationsModal(!showRecommendationsModal);
    if (type === "artists") {
      const theSeed: string[] = [];

      await seed?.items?.slice(0, 5).forEach((item) => theSeed.push(item.id));
      setSeedValue(theSeed);
    } else if (type === "tracks") {
      const theSeed: string[] = [];

      await seed?.items?.slice(0, 5).forEach((item) => theSeed.push(item.id));
      setSeedValue(theSeed);
    }
  };

  useEffect(() => {
    if (showRecommendationsModal) {
      fetchTrackRecommendations(seedValue, type);
    }
  }, [seedValue]);

  const handleClickOutside = (event) => {
    if (modal.current && !modal.current.contains(event.target)) {
      setShowRecommendationsModal(false);
    }
  };

  const onModalOpen = () => {
    disableBodyScroll(modal);
  };

  const onModalClose = () => {
    enableBodyScroll(modal);
    setRecommendations(null);
  };

  useEffect(() => {
    showRecommendationsModal ? onModalOpen() : onModalClose();
  }, [showRecommendationsModal]);

  return (
    <>
      <button
        onClick={() => handleRecommendationsModalOpen()}
        className="recommendations_open-button"
      >
        GENERATE RECOMMENDATIONS
      </button>{" "}
      <AnimatePresence>
        {showRecommendationsModal && (
          <div
            id="recommendations_modal-container"
            onClick={(event) => handleClickOutside(event)}
          >
            <motion.div
              initial={{ opacity: 0, y: -300 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 300 }}
              ref={modal}
              className="recommendations_modal-content"
            >
              <button
                onClick={() => setShowRecommendationsModal(false)}
                className="recommendations_modal-button_close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <h2>Recommendations</h2>
              <p>based on your top {type}</p>{" "}
              {fetchingRecommendations && <LoadingSpinner />}
              {recommendations && (
                <div className="recommendations_modal-tracks">
                  <TrackList
                    trackData={recommendations}
                    tracksAreFetchable={false}
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TrackRecommendations;
