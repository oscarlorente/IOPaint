import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onCheckedChange }) => {
  const { t } = useTranslation();
  
  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    onCheckedChange(checked === true);
  };
  
  return (
    <form>
      <div>
        <div className="flex items-center">
          <Checkbox.Root
            className="shadow-blackA4 hover:bg-violet3 flex h-[18px] w-[18px] appearance-none items-center justify-center rounded-[4px] bg-white outline-none"
            id="c1"
            checked={checked}
            onCheckedChange={handleCheckboxChange}
          >
            <Checkbox.Indicator className="text-primary">
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label className="pl-[15px] text-[15px] leading-none text-white" htmlFor="c1">
            {t(label)}
          </label>
        </div>
      </div>
    </form>
  );
};

export default CheckboxItem;