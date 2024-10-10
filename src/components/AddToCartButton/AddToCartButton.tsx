/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import CartIcon from '../../icons/cart.svg';
import ListIcon from '../../icons/shoppinglist.svg';
import {useState, useRef, useEffect, MouseEventHandler} from 'react';
import {JSXInternal} from 'preact/src/jsx';

export interface AddToCartButtonProps {
  variant?: 'cart' | 'list',
  onClick: (wishlist?: string) => void;
  popoverData?: Array<{id: string, name: string;}>;
  openCreateListPopup?: () => void;
}

export const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({
  variant = 'cart',
  onClick,
  popoverData = [],
  openCreateListPopup = () => undefined,
}: AddToCartButtonProps) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClick = (wishlist?: string) => {
    if (variant === 'list' && popoverData.length > 1) {
      if (isPopoverOpen) {
        onClick(wishlist);
      }
      setPopoverOpen(!isPopoverOpen);
    } else {
      onClick(wishlist);
    }
  }

  const handleCreateNewClick = (event: Event) => {
    event.preventDefault();
    openCreateListPopup();
  }

  // Close the popover if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setPopoverOpen(false);
      }
    };
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  const Icon = variant === 'list' ? ListIcon : CartIcon;
  return (
    <div className="ds-sdk-add-to-cart-button" ref={popoverRef}>
      <button
        className="flex items-center justify-center text-blue text-sm h-[32px] p-sm hover:border-gray-400"
        onClick={() => handleClick()}
        aria-label={variant === 'list' ? 'Add to shopping list' : 'Add to cart'}
      >
        <Icon className="w-[20px]" />
      </button>
      {isPopoverOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
          <div
            className="absolute top-0 right-10 w-3 h-3 -mt-2 rotate-45 bg-white border-l border-t border-gray-200"></div>
          <div className="py-1">
            {popoverData.map(({id, name}) => (
              <a
                key={id}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleClick(id)}
              >
                {name}
              </a>
            ))}
            <a
              onClick={handleCreateNewClick}
              className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 cursor-pointer"
            >
              + Create New Shopping List
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
