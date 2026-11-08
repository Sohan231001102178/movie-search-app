import React, { useState } from 'react';
import { X, Key, CheckCircle2, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import { getActiveApiKey, setActiveApiKey } from '../api/omdbService';

export const ApiKeyModal = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKeyInput, setApiKeyInput] = useState(() => getActiveApiKey());
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setActiveApiKey(apiKeyInput.trim());
    setSaveSuccess(true);
    if (onKeyUpdated) onKeyUpdated(apiKeyInput.trim());
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleUseDemoKey = () => {
    const demo = 'b9bd48a6';
    setApiKeyInput(demo);
    setActiveApiKey(demo);
    setSaveSuccess(true);
    if (onKeyUpdated) onKeyUpdated(demo);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container api-key-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="api-key-header">
          <div className="key-icon-wrapper">
            <Key size={26} className="text-amber-400" />
          </div>
          <h3 className="api-key-title">OMDb API Configuration</h3>
          <p className="api-key-desc">
            As specified in Assignment 10, requests require an active OMDb API key. You can also configure it in <code>.env</code> as <code>VITE_OMDB_API_KEY</code>.
          </p>
        </div>

        <form onSubmit={handleSave} className="api-key-form">
          <label className="form-label" htmlFor="apiKeyInput">
            Active API Key
          </label>
          <div className="key-input-wrapper">
            <input
              id="apiKeyInput"
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="e.g. b9bd48a6"
              className="key-input"
            />
          </div>

          <div className="key-hints">
            <a
              href="https://www.omdbapi.com/apikey.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="key-link"
            >
              <span>Get Free Key (1,000 daily queries)</span>
              <ExternalLink size={12} />
            </a>
            <button
              type="button"
              className="demo-key-btn"
              onClick={handleUseDemoKey}
            >
              Reset to Default Demo Key
            </button>
          </div>

          {saveSuccess && (
            <div className="success-banner">
              <CheckCircle2 size={16} /> Key applied successfully! Reloading query...
            </div>
          )}

          <div className="modal-form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save & Apply Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;
