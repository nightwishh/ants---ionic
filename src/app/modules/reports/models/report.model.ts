export interface Clients {
uid:string,
Name:string,
Group:string,
FullName:string
}
export interface ClientsBalances {
Client:string,
ClientBalanceCur:number,
ClientBalanceEq:number
}
export interface Balances extends Clients, ClientsBalances {

}