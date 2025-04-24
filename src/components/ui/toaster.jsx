"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast } from "./use-toast"
import {CheckCircle, XCircle} from "lucide-react";
import * as React from "react";

export function Toaster() {
  const { toasts } = useToast()

  return (
    (<ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          (<Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription><div className={"flex gap-2"}>
                  {props.variant === "destructive" ?  <XCircle className="h-5 w-5 text-white-500" /> : <span><CheckCircle className="h-5 w-5 text-green-500" /></span>}

                  {description}
                </div></ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}
