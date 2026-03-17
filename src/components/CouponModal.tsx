import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CouponModal({ isOpen, onClose }: CouponModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const couponCode = 'MASP15CAFE';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-6"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background w-full max-w-md p-8 totem-shadow relative"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">15% OFF no Café</h3>
                    <p className="text-sm text-muted-foreground">MASP A Baianeira</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Preencha seus dados e ganhe um cupom de 15% de desconto no café do MASP!
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-border focus:ring-primary"
                  />
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border focus:ring-primary"
                  />
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base py-6">
                    Ganhar cupom
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-primary mx-auto flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-black mb-2 text-foreground">Cupom gerado!</h3>
                <div className="bg-masp-light border-2 border-dashed border-primary p-4 my-4">
                  <p className="text-xs text-muted-foreground mb-1">Seu código:</p>
                  <p className="text-2xl font-black text-primary tracking-wider">{couponCode}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Apresente este código no <strong>MASP A Baianeira</strong> e ganhe 15% de desconto!
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  Ter a Sex: 11h30–15h · Sáb e Dom: 11h30–16h
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
