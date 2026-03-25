import { useState, type SubmitEvent } from 'react';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface ContactFormProps {
  action?: string;
}

export function ContactForm({ action = '/api/contact' }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMessage(data.message ?? '送信に失敗しました。しばらくしてからお試しください。');
      }
    } catch {
      setStatus('error');
      setErrorMessage('ネットワークエラーが発生しました。接続を確認して再度お試しください。');
    }
  };
  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-6 text-center" role="status" aria-live="polite">
        <p className="font-medium text-green-800">送信が完了しました</p>
        <p className="mt-1 text-sm text-green-700">お問い合わせありがとうございます。内容を確認のうえ、ご連絡いたします。</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-black/60">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-b border-black/30 bg-transparent px-0 py-2 text-sm text-black placeholder-black/40 outline-none transition-colors focus:border-black/60 md:text-base"
          placeholder="お名前"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-black/60">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-black/30 bg-transparent px-0 py-2 text-sm text-black placeholder-black/40 outline-none transition-colors focus:border-black/60 md:text-base"
          placeholder="メールアドレス"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-black/60">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none border-b border-black/30 bg-transparent px-0 py-2 text-sm text-black placeholder-black/40 outline-none transition-colors focus:border-black/60 md:text-base"
          placeholder="お問い合わせ内容"
        />
      </div>
      {status === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-black/40 rounded-full text-xs font-medium tracking-[0.18em] uppercase bg-black/5 hover:bg-black/10 hover:border-black/70 text-black transition-colors">
        送信
      </button>
    </form>
  );
}
