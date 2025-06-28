export interface Block {
  id: string;
  type: 'action' | 'loop' | 'condition' | 'wait' | 'sound';
  label: string;
  icon: string;
  color: string;
  params?: {
    direction?: 'forward' | 'backward' | 'left' | 'right' | 'jump' | 'dance' | 'spin' | 'wave';
    count?: number;
    duration?: number;
  };
}

export interface AlgorithmBlock extends Block {
  position: number;
}
