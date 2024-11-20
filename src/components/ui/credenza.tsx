"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface BaseProps {
  children: React.ReactNode;
}

interface RootCredenzaProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (_open: boolean) => void;
}

interface CredenzaProps extends BaseProps {
  className?: string;
  asChild?: true;
  disableOutsideClick?: boolean;
}

const desktop = "(min-width: 768px)";

const Credenza = ({ children, ...props }: RootCredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const Credenza = isDesktop ? Dialog : Drawer;

  return <Credenza {...props}>{children}</Credenza>;
};

const CredenzaTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <CredenzaTrigger className={className} {...props}>
      {children}
    </CredenzaTrigger>
  );
};

const CredenzaClose = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <CredenzaClose className={className} {...props}>
      {children}
    </CredenzaClose>
  );
};

const CredenzaContent = ({ className, children, disableOutsideClick = true, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaContent = isDesktop ? DialogContent : DrawerContent;
  const isDialog = CredenzaContent === DialogContent ? disableOutsideClick : undefined;

  return (
    <CredenzaContent disableOutsideClick={isDialog} className={className} {...props}>
      {children}
    </CredenzaContent>
  );
};

const CredenzaDescription = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <CredenzaDescription className={className} {...props}>
      {children}
    </CredenzaDescription>
  );
};

const CredenzaHeader = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <CredenzaHeader className={className} {...props}>
      {children}
    </CredenzaHeader>
  );
};

const CredenzaTitle = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <CredenzaTitle className={className} {...props}>
      {children}
    </CredenzaTitle>
  );
};

const CredenzaBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div
      className={cn(
        "max-h-[75vh] overflow-y-auto px-4 md:px-[0.125rem] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-primary-200/65 [&::-webkit-scrollbar]:w-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CredenzaFooter = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <CredenzaFooter className={className} {...props}>
      {children}
    </CredenzaFooter>
  );
};

export {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
};
