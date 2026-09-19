create or replace function public.get_public_order_tracking(p_tracking_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  tracking jsonb;
begin
  if p_tracking_token is null or btrim(p_tracking_token) = '' then
    raise exception 'tracking token is required' using errcode = '22023';
  end if;

  select jsonb_build_object(
    'order_number', orders.order_number,
    'status', orders.status,
    'estimated_delivery', orders.estimated_delivery,
    'created_at', orders.created_at,
    'total', orders.total,
    'tracking_events', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'status', events.status,
            'note', events.note,
            'created_at', events.created_at
          )
          order by events.created_at asc
        )
        from public.tracking_events as events
        where events.order_id = orders.id
      ),
      '[]'::jsonb
    )
  )
  into tracking
  from public.orders as orders
  where orders.tracking_token = p_tracking_token;

  return tracking;
end;
$$;

revoke all on function public.get_public_order_tracking(text) from public;
grant execute on function public.get_public_order_tracking(text) to anon, authenticated;
