import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

interface AnimatedTerminalProps {
  commands?: string[];
  intervalMs?: number;
}

const DEFAULT_COMMANDS = [
  "Explore Live APIs",
  "LLM Integration",
  "MCP Guide",
  "Build AI Agents",
  "Explainer Videos",
  "Chat with AI Agents",
  "Mind Maps",
  "Downloadable Templates",
  "Smart Documentation",
  "From Docs to Deployment in Minutes",
  "AI-Powered Developer Experience",
  "Test, Build, Ship - All in One Place",
  "Your AI Agent Launchpad",
];

const AnimatedTerminal: React.FC<AnimatedTerminalProps> = ({ commands, intervalMs = 4000 }) => {
  const entries = useMemo(() => {
    if (commands && commands.length > 0) {
      return commands;
    }
    return DEFAULT_COMMANDS;
  }, [commands]);

  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(entries[0]);

  useEffect(() => {
    setCurrentFeatureIndex(0);
    setCurrentFeature(entries[0]);
  }, [entries]);

  useEffect(() => {
    if (entries.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % entries.length;
        setCurrentFeature(entries[nextIndex]);
        return nextIndex;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [entries, intervalMs]);

  return (
    <StyledWrapper>
      <div className="card">
        <div className="wrap">
          <div className="terminal">
            <hgroup className="head">
              <p className="title">
                <svg
                  width="16px"
                  height="16px"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                >
                  <path d="M7 15L10 12L7 9M13 15H17M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" />
                </svg>
                Terminal
              </p>
              <button className="copy_toggle" tabIndex={-1} type="button">
                <svg
                  width="16px"
                  height="16px"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                >
                  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                  <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                </svg>
              </button>
            </hgroup>
            <div className="body">
              <pre className="pre">
                <code className="cmd" data-cmd={currentFeature} key={`${currentFeature}-${currentFeatureIndex}`} />
              </pre>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    padding: 0.75rem;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    min-width: 280px;
    max-width: 650px;
    width: 100%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  @media (min-width: 640px) {
    .card {
      padding: 1rem;
    }
  }
  .wrap {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    z-index: 10;
    border: 0.5px solid #d1d5db;
    border-radius: 8px;
    overflow: hidden;
  }
  .terminal {
    display: flex;
    flex-direction: column;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    min-height: 40px;
    padding-inline: 12px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #374151;
  }
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 2.5rem;
    user-select: none;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #d1d5db;
    font-size: 14px;
  }
  .title > svg {
    height: 18px;
    width: 18px;
    margin-top: 2px;
    color: #3b82f6;
  }
  .copy_toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border: 0.65px solid #6b7280;
    margin-left: auto;
    border-radius: 6px;
    background-color: #374151;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .copy_toggle:hover {
    background-color: #4b5563;
    border-color: #9ca3af;
  }
  .copy_toggle > svg {
    width: 16px;
    height: 16px;
  }
  .copy_toggle:active > svg > path,
  .copy_toggle:focus-within > svg > path {
    animation: clipboard-check 500ms linear forwards;
  }
  .body {
    display: flex;
    flex-direction: column;
    position: relative;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    overflow-x: auto;
    padding: 0.75rem;
    line-height: 20px;
    color: #e5e7eb;
    background-color: #1f2937;
    white-space: nowrap;
  }
  
  @media (min-width: 640px) {
    .body {
      padding: 1.25rem;
      line-height: 22px;
    }
  }
  .pre {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-wrap: nowrap;
    white-space: pre;
    background-color: transparent;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 13px;
    margin: 0;
  }
  
  @media (min-width: 640px) {
    .pre {
      font-size: 16px;
    }
  }
  .cmd {
    height: 22px;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: row;
    color: #fbbf24;
    font-weight: 500;
  }
  .cmd::before {
    content: attr(data-cmd);
    position: relative;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    background-color: transparent;
    animation: typing 2.5s ease-in-out 0.3s both;
  }
  .cmd::after {
    content: "";
    position: relative;
    display: block;
    height: 100%;
    overflow: hidden;
    background-color: transparent;
    border-right: 0.15em solid #fbbf24;
    animation: cursor 0.75s step-end infinite alternate, blinking 0.75s infinite;
  }

  @keyframes blinking {
    20%, 80% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(0);
    }
  }

  @keyframes cursor {
    50% {
      border-right-color: transparent;
    }
  }

  @keyframes typing {
    0% {
      width: 0;
    }
    85% {
      width: 100%;
      max-width: max-content;
    }
    100% {
      width: 100%;
      max-width: max-content;
    }
  }

  @keyframes clipboard-check {
    100% {
      color: #10b981;
      d: path(
        "M 9 5 H 7 a 2 2 0 0 0 -2 2 v 12 a 2 2 0 0 0 2 2 h 10 a 2 2 0 0 0 2 -2 V 7 a 2 2 0 0 0 -2 -2 h -2 M 9 5 a 2 2 0 0 0 2 2 h 2 a 2 2 0 0 0 2 -2 M 9 5 a 2 2 0 0 1 2 -2 h 2 a 2 2 0 0 1 2 2 m -6 9 l 2 2 l 4 -4"
      );
    }
  }
`;

export default AnimatedTerminal;
