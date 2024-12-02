import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface MyDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const MyDialog: React.FC<MyDialogProps> = ({ open, onClose, onConfirm }) => {
  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <>
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition duration-500 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-125 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Dialog open={open} onClose={onClose} className="relative z-10">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-bgc-dark p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Are you sure?
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 dark:text-white">
                        You won&apos;t be able to revert this!
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={onClose}
                        className="bg-red-500 text-white rounded-md px-3 py-2"
                      >
                        No, cancel!
                      </button>
                      <button
                        onClick={onConfirm}
                        className="bg-gbgc text-white rounded-md px-3 py-2"
                      >
                        Yes, delete it!
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default MyDialog;
