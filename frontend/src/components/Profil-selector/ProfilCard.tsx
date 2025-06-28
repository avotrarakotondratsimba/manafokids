"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProfileCardProps {
  username: string;
  initials: string;
  color: string;
  onDelete?: () => void;
  onClick?: () => void;
}

const ProfileCard = ({
  username,
  initials,
  color,
  onDelete,
  onClick,
}: ProfileCardProps) => {
  return (
    <div className="relative group">
      <Card
        className={`w-24 h-24 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${color}`}
        onClick={onClick}
      >
        <div className="text-white font-bold text-xl mb-1">{initials}</div>
        <div className="text-white text-xs text-center px-1 truncate w-full">
          {username}
        </div>
      </Card>

      {onDelete && (
        <Button
          size="sm"
          variant="destructive"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

export default ProfileCard;
