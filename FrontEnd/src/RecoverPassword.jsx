import React, { useState, useRef } from 'react';
import './LogIn.css'; // Reutilizamos los estilos del login

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const codeRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        codeRefs.current[index + 1].focus();
      } else if (!value && index > 0) {
        codeRefs.current[index - 1].focus();
      }
    }
  };

  const handleSendCode = () => {
    if (!email) {
      alert('Por favor ingresa tu correo.');
      return;
    }
    alert(`Código enviado a ${email}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, code: code.join(''), newPassword, confirmPassword });
    alert('Contraseña actualizada');
  };

  const handleGoBackBrowser = () => {
    window.history.back();
  };

  return (
    <div className="login-container">
      <header className="bg-white shadow-sm sticky-top header-container">
        <div className="container">
          <div className="row align-items-center py-3">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <button onClick={handleGoBackBrowser} className="back-btn me-4" title="Volver">
                  ←
                </button>
                <div className="logo-text">Happy-Art Eventos</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="login-content mt-4">
        <div className="login-form-card">
          <h1 className="login-title">Recuperar Contraseña</h1>

          <form onSubmit={handleSubmit}>
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
                  className="btn-primary-custom"
                  onClick={handleSendCode}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Enviar código
                </button>
              </div>
            </div>

            <div className="code-inputs mb-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (codeRefs.current[index] = el)}
                  className="code-box"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                />
              ))}
            </div>

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
                  {showNewPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

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
                  {showConfirmPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-primary-custom w-100">
              Confirmar nueva contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
