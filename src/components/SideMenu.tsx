// src/components/SideMenu.tsx
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";

export default function SideMenu() {
  const { isOpen, close } = useModal();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const goToDeletePage = () => {
    close();
    navigate("/delete");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
    close();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={close}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/30 z-40 pointer-events-none"
            aria-hidden="true"
          />
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
              <Dialog.Panel className="fixed left-0 top-0 z-50 w-80 max-w-full h-full bg-white dark:bg-gray-900 shadow-xl flex flex-col">
                <div className="p-6 flex flex-col h-full overflow-y-auto">
                  <Dialog.Title className="text-lg font-medium mb-4">
                    Menu
                  </Dialog.Title>

                  <nav className="flex-1 space-y-2">
                    {/* New Chat */}
                    <Link
                      to="/dentgo-chat"
                      onClick={close}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-primary stroke-current"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <rect
                            opacity="0.08"
                            width="48"
                            height="48"
                            rx="8"
                            fill="currentColor"
                          />
                          <g>
                            <path
                              d="M24 17V31"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17 24H31"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        <span className="text-gray-800 font-medium text-base">
                          New Chat
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    {/* History */}
                    <Link
                      to="/history"
                      onClick={close}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-primary stroke-current"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <rect
                            opacity="0.08"
                            width="48"
                            height="48"
                            rx="8"
                            fill="currentColor"
                          />
                          <g>
                            <path
                              d="M24 20V24L26 26"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.0498 23.0001C15.2739 20.8001 16.3001 18.7597 17.9325 17.268C19.565 15.7764 21.6895 14.938 23.9007 14.9127C26.1119 14.8874 28.255 15.6771 29.9211 17.1311C31.5872 18.5851 32.6597 20.6015 32.934 22.7958C33.2083 24.99 32.6651 27.2085 31.4082 29.0278C30.1512 30.8472 28.2684 32.1401 26.1191 32.6599C23.9697 33.1797 21.7042 32.89 19.7548 31.8461C17.8054 30.8022 16.3082 29.0772 15.5498 27.0001M15.0498 32.0001V27.0001H20.0498"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        <span className="text-gray-800 font-medium text-base">
                          History
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    {/* Wallet */}
                    <Link
                      to="/wallet"
                      onClick={close}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-primary stroke-current"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <rect
                            opacity="0.08"
                            width="48"
                            height="48"
                            rx="8"
                            fill="currentColor"
                          />
                          <g>
                            <path
                              d="M15 18H33V30H15V18Z"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M33 22H27C26.4696 22 26 22.4696 26 23C26 23.5304 26.4696 24 27 24H33"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        <span className="text-gray-800 font-medium text-base">
                          Wallet
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    {/* Notification Settings */}
                    <Link
                      to="/notification-setting"
                      onClick={close}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-primary stroke-current"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <rect
                            opacity="0.08"
                            width="48"
                            height="48"
                            rx="8"
                            fill="currentColor"
                          />
                          <g>
                            <path
                              d="M22 17C22 16.4696 22.2107 15.9609 22.5858 15.5858C22.9609 15.2107 23.4696 15 24 15C24.5304 15 25.0391 15.2107 25.4142 15.5858C25.7893 15.9609 26 16.4696 26 17C27.1484 17.543 28.1274 18.3883 28.8321 19.4453C29.5367 20.5023 29.9404 21.7311 30 23V26C30.0753 26.6217 30.2954 27.2171 30.6428 27.7381C30.9902 28.2592 31.4551 28.6914 32 29H16C16.5449 28.6914 17.0098 28.2592 17.3572 27.7381C17.7046 27.2171 17.9247 26.6217 18 26V23C18.0596 21.7311 18.4633 20.5023 19.1679 19.4453C19.8726 18.3883 20.8516 17.543 22 17"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M21 29V30C21 30.7956 21.3161 31.5587 21.8787 32.1213C22.4413 32.6839 23.2044 33 24 33C24.7956 33 25.5587 32.6839 26.1213 32.1213C26.6839 31.5587 27 30.7956 27 30V29"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        <span className="text-gray-800 font-medium text-base">
                          Notification Settings
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    {/* Currency */}
                    <Link
                      to="/currency"
                      onClick={close}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-primary stroke-current"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <rect
                            opacity="0.08"
                            width="48"
                            height="48"
                            rx="8"
                            fill="currentColor"
                          />
                          <g>
                            <path
                              d="M28.7 20C28.501 19.4352 28.1374 18.943 27.6563 18.5865C27.1751 18.2301 26.5983 18.0258 26 18H22C21.2044 18 20.4413 18.3161 19.8787 18.8787C19.3161 19.4413 19 20.2044 19 21C19 21.7956 19.3161 22.5587 19.8787 23.1213C20.4413 23.6839 21.2044 24 22 24H26C26.7956 24 27.5587 24.3161 28.1213 24.8787C28.6839 25.4413 29 26.2044 29 27C29 27.7956 28.6839 28.5587 28.1213 29.1213C27.5587 29.6839 26.7956 30 26 30H22C21.4017 29.9742 20.8249 29.7699 20.3437 29.4135C19.8626 29.057 19.499 28.5648 19.3 28"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M24 15V18M24 30V33"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        <span className="text-gray-800 font-medium text-base">
                          Currency
                        </span>
                      </div>
                      <span className="text-gray-500 font-medium">USD</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    {/* Terms & Privacy */}
                    <Link
                      to="/terms-and-privacy"
                      onClick={close}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-primary stroke-current"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <rect
                            opacity="0.08"
                            width="48"
                            height="48"
                            rx="8"
                            fill="currentColor"
                          />
                          <g>
                            <path
                              d="M24 33C28.9706 33 33 28.9706 33 24C33 19.0294 28.9706 15 24 15C19.0294 15 15 19.0294 15 24C15 28.9706 19.0294 33 24 33Z"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M24 20H24.01"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M23 24H24V28H25"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        <span className="text-gray-800 font-medium text-base">
                          Terms &amp; Privacy
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    {/* Contact Us */}
                    <Link
                      to="/contact-us"
                      onClick={close}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-primary stroke-current"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <rect
                            opacity="0.08"
                            width="48"
                            height="48"
                            rx="8"
                            fill="currentColor"
                          />
                          <g>
                            <path
                              d="M16 15H18C18.2652 15 18.5196 15.1054 18.7071 15.2929C18.8946 15.4804 19 15.7348 19 16V18C19 18.2652 18.8946 18.5196 18.7071 18.7071C18.5196 18.8946 18.2652 19 18 19H16C15.7348 19 15.4804 18.8946 15.2929 18.7071C15.1054 18.5196 15 18.2652 15 18V16C15 15.7348 15.1054 15.4804 15 15.2929C15.4804 15.1054 15.7348 15 16 15Z"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M30 15H32C32.2652 15 32.5196 15.1054 32.7071 15.2929C32.8946 15.4804 33 15.7348 33 16V18C33 18.2652 32.8946 18.5196 32.7071 18.7071C32.5196 18.8946 32.2652 19 32 19H30C29.7348 19 29.4804 18.8946 29.2929 18.7071C29.1054 18.5196 29 18.2652 29 18V16C29 15.7348 29.1054 15.4804 29 15.2929C29.4804 15.1054 29.7348 15 30 15Z"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M23 15H25C25.2652 15 25.5196 15.1054 25.7071 15.2929C25.8946 15.4804 26 15.7348 26 16V18C26 18.2652 25.8946 18.5196 25.7071 18.7071C25.5196 18.8946 25.2652 19 25 19H23C22.7348 19 22.4804 18.8946 22.2929 18.7071C22.1054 18.5196 22 18.2652 22 18V16C22 15.7348 22.1054 15.4804 22 15.2929C22.4804 15.1054 22.7348 15 23 15Z"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 22H18C18.2652 22 18.5196 22.1054 18.7071 22.2929C18.8946 22.4804 19 22.7348 19 23V25C19 25.2652 18.8946 25.5196 18.7071 25.7071C18.5196 25.8946 18.2652 26 18 26H16C15.7348 26 15.4804 25.8946 15.2929 25.7071C15.1054 25.5196 15 25.2652 15 25V23C15 22.7348 15.1054 22.4804 15 22.2929C15.4804 22.1054 15.7348 22 16 22Z"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        <span className="text-gray-800 font-medium text-base">
                          Contact Us
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    {/* Delete Account */}
                    <button
                      onClick={goToDeletePage}
                      className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-red-600 stroke-current"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <rect
                            opacity="0.08"
                            width="48"
                            height="48"
                            rx="8"
                            fill="currentColor"
                          />
                          <g>
                            <path
                              d="M22 22L26 26M26 22L22 26"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M24 15C31.2 15 33 16.8 33 24C33 31.2 31.2 33 24 33C16.8 33 15 31.2 15 24C15 16.8 16.8 15 24 15Z"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        <span className="text-gray-800 font-medium text-base">
                          Delete Account
                        </span>
                      </div>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-red-600 stroke-current"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <rect
                            opacity="0.08"
                            width="48"
                            height="48"
                            rx="8"
                            fill="currentColor"
                          />
                          <g>
                            <path
                              d="M26 20V18C26 17.4696 25.7893 16.9609 25.4142 16.5858C25.0391 16.2107 24.5304 16 24 16H17C16.4696 16 15.9609 16.2107 15.5858 16.5858C15.2107 16.9609 15 17.4696 15 18M16 18C16 18.5304 16.2107 19.0391 16.5858 19.4142C16.9609 19.7893 17.4696 20 18 20H30C30.2652 20 30.5196 20.1054 30.7071 20.2929C30.8946 20.4804 31 20.7348 31 21V24M16 18V30C16 30.5304 16.2107 31.0391 16.5858 31.4142C16.9609 31.7893 17.4696 32 18 32H30C30.2652 32 30.5196 31.8946 30.7071 31.7071C30.8946 31.5196 31 31.2652 31 31V28"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M21 24H33L30 21"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M30 27L33 24"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        <span className="text-gray-800 font-medium text-base">
                          Logout
                        </span>
                      </div>
                    </button>
                  </nav>

                  <button
                    onClick={close}
                    className="mt-4 text-sm text-primary underline"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
