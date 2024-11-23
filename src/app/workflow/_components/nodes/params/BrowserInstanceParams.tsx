"use client";
import { ParamProps } from "@/types/appNodes";
import React from "react";

const BrowserInstanceParams = ({ param }: ParamProps) => {
  return <p className="text-xs">{param.name}</p>;
};

export default BrowserInstanceParams;
