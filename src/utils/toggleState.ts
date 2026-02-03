import * as React from 'react';

export const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
  setter((prev) => !prev);
};
