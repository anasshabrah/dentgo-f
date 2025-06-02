import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useModal } from "../../context/ModalContext";

export default function SideMenu() {
  const { close } = useModal();

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative w-80 max-w-full h-full bg-white dark:bg-gray-900 shadow-xl p-6 flex flex-col">
                <Dialog.Title className="text-lg font-medium mb-4">Menu</Dialog.Title>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                  <Link to="/dentgo-chat"        className="block" onClick={close}>New Chat</Link>
                  <Link to="/history"           className="block" onClick={close}>History</Link>
                  <Link to="/bank-cards"         className="block" onClick={close}>Banks & Cards</Link>
                  <Link to="/payment-method"     className="block" onClick={close}>Payment Methods</Link>
                  <Link to="/cancel-subscription"className="block" onClick={close}>Subscriptions</Link>
                  <Link to="/notification-setting"className="block" onClick={close}>Notifications</Link>
                  <Link to="/currency"          className="block" onClick={close}>Currency</Link>
                  <Link to="/terms-and-privacy"   className="block" onClick={close}>Terms & Privacy</Link>
                  <Link to="/contact-us"         className="block" onClick={close}>Contact Us</Link>
                </nav>

                <button
                  onClick={close}
                  className="mt-4 text-sm text-primary underline"
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
