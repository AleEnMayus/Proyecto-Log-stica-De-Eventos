import React, { useState, useRef, useEffect } from 'react';
import '../CSS/FormsUser.css';
import ToastContainer from '../../components/ToastContainer';
import { useToast } from '../../hooks/useToast';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [codeTimer, setCodeTimer] = useState(0);

  const { toasts, addToast, removeToast } = useToast();
  const codeRefs = useRef([]);

  // Temporizador del código
  useEffect(() => {
    if (codeTimer <= 0) return;
    const interval = setInterval(() => {
      setCodeTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [codeTimer]);

  // Limpieza de datos sensibles al desmontar
  useEffect(() => {
    return () => {
      setNewPassword('');
      setConfirmPassword('');
      setCode(['', '', '', '']);
    };
  }, []);

  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        codeRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        codeRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSendCode = async () => {
    if (!email) {
      setErrorMessage('Por favor ingresa tu correo.');
      return;
    }

    setCodeTimer(180); // 3 minutos

    try {
      const response = await fetch('http://localhost:4000/api/password/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: 'Error inesperado del servidor.' };
      }

      if (response.ok) {
        addToast(data.message || 'Código enviado', 'success');
        setErrorMessage('');
      } else {
        setCodeTimer(0);
        setErrorMessage(data.message || 'Error al enviar el código');
        addToast(data.message || 'Error al enviar el código', 'error');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor');
      addToast('Error al conectar con el servidor', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.some((digit) => digit === '')) {
      setErrorMessage('Por favor ingresa el código completo.');
      return;
    }

    const validatePassword = (password) => {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      return re.test(password);
    };

    if (!validatePassword(newPassword)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: code.join(''),
          newPassword,
        }),
      });

      let errorData;
      if (response.ok) {
        addToast('Contraseña actualizada exitosamente', 'success');
        setErrorMessage('');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: 'Error inesperado del servidor' };
        }
        setErrorMessage(errorData.message || 'Error al actualizar la contraseña');
        addToast(errorData.message || 'Error al actualizar la contraseña', 'error');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor');
      addToast('Error al conectar con el servidor', 'error');
    }
  };

  const handleGoBackBrowser = () => {
    window.history.back();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="login-container">
      <header className="bg-white shadow-sm sticky-top header-container">
        <div className="container">
          <div className="row align-items-center py-3">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <button onClick={handleGoBackBrowser} className="back-btn me-4 mb-0" title="Volver">
                  ←
                </button>
                <div className="logo-text">Happy-Art-Events</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="login-content container mt-4">
        <div className="login-form-card form-card-500">
          <h1 className="login-title">Recuperar Contraseña</h1>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            {/* Correo */}
            <div className="form-group mb-3">
              <label>Correo</label>
              <div className="d-flex">
                <input
                  type="email"
                  className="form-input me-2"
                  placeholder="example.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-send-code"
                  onClick={handleSendCode}
                  disabled={codeTimer > 0}
                >
                  {codeTimer > 0 ? `Reenviar en ${formatTime(codeTimer)}` : 'Enviar código'}
                </button>
              </div>
            </div>

            {/* Código */}
            <div className="code-inputs mb-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (codeRefs.current[index] = el)}
                  className="code-box"
                  maxLength="1"
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !code[index] && index > 0) {
                      codeRefs.current[index - 1]?.focus();
                    }
                  }}
                />
              ))}
            </div>

            {/* Nueva contraseña */}
            <div className="form-group mb-3 password-group">
              <label>Nueva Contraseña</label>
              <div className="input-with-icon">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-visibility-inside"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" />
                      <path d="M1 1l22 22" />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="form-group mb-4 password-group">
              <label>Confirmar Contraseña</label>
              <div className="input-with-icon">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-visibility-inside"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" />
                      <path d="M1 1l22 22" />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-primary-custom w-100">
              Confirmar nueva contraseña
            </button>
          </form>
        </div>
      </div>

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default RecoverPassword;