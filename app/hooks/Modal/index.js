import { useCallback, useState } from 'react';

export function useModal(initialShow = false) {
  const [show, setShow] = useState(initialShow);

  const openModal = useCallback(() => setShow(true), []);

  const closeModal = useCallback(() => setShow(false), []);

  return [show, openModal, closeModal];
}
