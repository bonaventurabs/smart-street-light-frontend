import tableStyles from '../../styles/Table.module.css'
import fontStyles from '../../styles/Font.module.css'

const Tag = ({isActive}) => {
  return ( isActive 
    ? <div className={tableStyles.activeTag}>
        <span className={`${fontStyles.subText} ${tableStyles.tagText}`}>Active</span>
      </div>
    : <div className={tableStyles.inactiveTag}>
        <span className={`${fontStyles.subText} ${tableStyles.tagText}`}>Inactive</span>
      </div>
  );
};

export default Tag;