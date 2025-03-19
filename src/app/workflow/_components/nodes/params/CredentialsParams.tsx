"use client";
import { getUserCredentials } from "@/actions/credentials/getUsercredentials";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { ParamProps } from "@/types/appNodes";
import { useQuery } from "@tanstack/react-query";
import React, { useId } from "react";

const CredentialParams = ({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) => {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials"],
    queryFn: () => getUserCredentials(),
    refetchInterval: 10000,
  });
  return (
    <p className="flex flex-col gap-1 w-full">
      <Label htmlFor={param.id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((credential) => (
              <SelectItem key={credential.id} value={credential.id.toString()}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </p>
  );
};

export default CredentialParams;
