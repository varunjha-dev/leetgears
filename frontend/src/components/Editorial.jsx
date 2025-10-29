import { useState, useRef, useEffect } from 'react';
import { Pause, Play, VideoOff, Search } from 'lucide-react';
import { API_PATHS } from '../utils/constants';
import '../index.css';

const Editorial = ({ secureUrl, thumbnailUrl, duration, problemTitle, problemDescription }) => {
  const [videoId, setVideoId] = useState(null);
  const [isLoadingYoutubeVideo, setIsLoadingYoutubeVideo] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (!secureUrl) {
      setIsLoadingYoutubeVideo(true);
      const fetchYoutubeVideo = async () => {
        const searchQuery = encodeURIComponent(`${problemTitle} ${problemDescription} tutorial`);
        const youtubeSearchUrl = API_PATHS.searchOnYoutube(searchQuery);

        try {
          const response = await fetch(youtubeSearchUrl);
          const data = await response.json();

          if (data.items && data.items.length > 0) {
            setVideoId(data.items[0].id.videoId);
          } else {
            console.error("No YouTube videos found for this problem.");
          }
        } catch (error) {
          console.error("Error fetching YouTube video:", error);
        } finally {
          setIsLoadingYoutubeVideo(false);
        }
      };
      fetchYoutubeVideo();
    } else {
      setVideoId(null); // Reset videoId if secureUrl is present
    }
  }, [secureUrl, problemTitle, problemDescription]);

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div 
      className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg"
    >
      <div
        className="relative w-full aspect-video bg-black"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {secureUrl ? (
          <>
            {/* Video Element */}
            <video
              ref={videoRef}
              src={secureUrl}
              poster={thumbnailUrl}
              onClick={togglePlayPause}
              className="w-full h-full cursor-pointer"
            />
            
            {/* Video Controls Overlay */}
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="btn btn-circle btn-primary mr-3"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause/>
                ) : (
                  <Play/>
                )}
              </button>
              
              {/* Progress Bar */}
              <div className="flex items-center w-full mt-2">
                <span className="text-white text-sm mr-2">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Number(e.target.value);
                    }
                  }}
                  className="range range-primary range-xs flex-1"
                />
                <span className="text-white text-sm ml-2">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </>
        ) : videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : isLoadingYoutubeVideo ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white shimmer-effect rounded-xl shadow-lg">
            {/* Optional: You can still have a hidden spinner or text for accessibility */}
            <span className="sr-only">Loading video...</span>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-white p-4 rounded-xl shadow-lg">
            <VideoOff size={48} className="text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-center">No editorial video available.</p>
            <p className="text-sm text-gray-400 text-center mt-1">Searching YouTube for relevant tutorials...</p>
          </div>
        )} 
      </div>

      {/* Relevant Sources Section - Display always when problemTitle is present */}
      {problemTitle && (
        <div className="mt-6 p-4 bg-base-200 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Relevant Sources for this Problem:</h3>
          <a 
            href={API_PATHS.searchOnGoogle(encodeURIComponent(`${problemTitle} ${problemDescription} geeksforgeeks OR leetcode OR medium`))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-outline btn-md w-full no-underline flex items-center justify-center space-x-2"
          >
            <Search size={20} />
            <span>Search for articles on Google</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Editorial;