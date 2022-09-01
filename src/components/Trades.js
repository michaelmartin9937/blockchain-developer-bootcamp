import { useSelector } from 'react-redux';
import { filledOrdersSelector } from '../store/selectors';
import sort from '../assets/sort.svg';
import Banner from './Banner';

const Trades = () => {

  const filledOrders = useSelector(filledOrdersSelector)
  const symbols = useSelector(state => state.tokens.symbols)

  return (
    <div className="component exchange__trades">
      <div className='component__header flex-between'>
        <h2>Trades</h2>
      </div>


        {!filledOrders || filledOrders.length === 0 ? (
          <Banner text={'No transactions'} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Time<img src={sort} alt="sort" /></th>
                  <th>{symbols && symbols[0]}<img src={sort} alt="sort" /></th>
                  <th>{symbols && symbols[0]}/{symbols && symbols[1]}<img src={sort} alt="sort" /></th>
                </tr>
              </thead>
              <tbody>

                {/* MAPPING OF ORDERS */}
                {filledOrders && filledOrders.map((orders, index) => {
                    return (
                       <tr key={index}>
                        <td>{orders.formattedTimestamp}</td>
                        <td style={{ color: `${orders.tokenPriceClass}` }}>{orders.token0Amount}</td>
                        <td>{orders.tokenPrice}</td>
                      </tr>
                    )
                  })}
               
              </tbody>
            </table>
          ) }

    

    </div>
  );
}

export default Trades;
