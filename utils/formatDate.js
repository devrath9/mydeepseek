
export const formatdate=(datestring)=>{
 
    let date = new Date(datestring)

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: '2-digit'
}).format(date);

return formattedDate
}