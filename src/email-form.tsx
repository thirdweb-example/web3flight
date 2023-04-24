import React, { useState } from "react";

interface EmailFormProps {
  onSubmit: (email: string) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="content">
      <label htmlFor="email">Username:</label>
      <br />
      <input
        id="email"
        name="email"
        value={email}
        onChange={handleInputChange}
        required
      />
      <br />
      <button type="submit">Connect</button>
    </form>
  );
};

export default EmailForm;
